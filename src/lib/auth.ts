export type UserRole = "admin" | "lender" | "agent";
export type UserStatus = "active" | "pending" | "rejected";
export type IdMethod = "world_id" | "national_id_photo" | "none";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  lenderId?: string;
  country?: string;
  licenceNumber?: string;
  status: UserStatus;
  registeredAt?: number;
  idMethod?: IdMethod;
  phone?: string;
  nationalIdNumber?: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

const USERS_KEY = "verifarm_users";
const TOKEN_KEY = "verifarm_token";
const PHOTO_PREFIX = "verifarm_photo_";

function hash(s: string): string {
  return btoa(encodeURIComponent(s) + "_vf2026");
}

const SEED_USERS: StoredUser[] = [
  {
    id: "admin-1",
    email: "admin@verifarm.co.tz",
    name: "Admin Wanjiku",
    role: "admin",
    status: "active",
    passwordHash: hash("admin123"),
  },
  {
    id: "lender-1",
    email: "kcb@example.com",
    name: "KCB Bank Tanzania",
    role: "lender",
    institution: "KCB Bank Tanzania",
    lenderId: "L001",
    country: "Tanzania",
    licenceNumber: "BOT-2021-0042",
    status: "active",
    passwordHash: hash("demo123"),
  },
  {
    id: "agent-1",
    email: "agent@verifarm.co.tz",
    name: "Field Agent Musa",
    role: "agent",
    status: "active",
    idMethod: "none",
    passwordHash: hash("agent123"),
  },
];

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_USERS;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeToken(user: AuthUser): string {
  return `vf.${btoa(JSON.stringify(user))}.demo`;
}

function parseToken(token: string): AuthUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "vf") return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export function storeIdPhoto(userId: string, dataUrl: string) {
  try {
    localStorage.setItem(`${PHOTO_PREFIX}${userId}`, dataUrl);
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

export function getIdPhoto(userId: string): string | null {
  return localStorage.getItem(`${PHOTO_PREFIX}${userId}`);
}

export function login(
  email: string,
  password: string
): { user: AuthUser; token: string } | { error: string } {
  const users = getUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) return { error: "No account found with that email." };
  if (found.passwordHash !== hash(password)) return { error: "Incorrect password." };
  if (found.status === "pending")
    return { error: "Your account is pending admin approval." };
  if (found.status === "rejected")
    return { error: "Your account application was not approved. Contact support." };
  const { passwordHash: _pw, ...authUser } = found;
  const token = makeToken(authUser);
  localStorage.setItem(TOKEN_KEY, token);
  return { user: authUser, token };
}

export function registerLender(data: {
  name: string;
  email: string;
  password: string;
  country: string;
  licenceNumber: string;
}): { success: true; user: AuthUser } | { error: string } {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { error: "An account with this email already exists." };
  }
  const newUser: StoredUser = {
    id: `lender-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: "lender",
    institution: data.name,
    lenderId: `L-${Date.now()}`,
    country: data.country,
    licenceNumber: data.licenceNumber,
    status: "pending",
    registeredAt: Date.now(),
    idMethod: "none",
    passwordHash: hash(data.password),
  };
  users.push(newUser);
  saveUsers(users);
  const { passwordHash: _pw, ...authUser } = newUser;
  return { success: true, user: authUser };
}

export function registerAgent(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  region: string;
  idMethod: IdMethod;
  nationalIdNumber?: string;
}): { success: true; user: AuthUser } | { error: string } {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { error: "An account with this email already exists." };
  }
  const newUser: StoredUser = {
    id: `agent-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: "agent",
    country: data.region,
    phone: data.phone,
    nationalIdNumber: data.nationalIdNumber,
    idMethod: data.idMethod,
    status: "pending",
    registeredAt: Date.now(),
    passwordHash: hash(data.password),
  };
  users.push(newUser);
  saveUsers(users);
  const { passwordHash: _pw, ...authUser } = newUser;
  return { success: true, user: authUser };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return parseToken(token);
}

export function getAllApplications(): AuthUser[] {
  return getUsers()
    .filter((u) => u.role !== "admin")
    .map(({ passwordHash: _pw, ...u }) => u);
}

export function getAllLenders(): AuthUser[] {
  return getUsers()
    .filter((u) => u.role === "lender" || u.role === "agent")
    .map(({ passwordHash: _pw, ...u }) => u);
}

export function approveUser(id: string): AuthUser | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx].status = "active";
    saveUsers(users);
    const { passwordHash: _pw, ...authUser } = users[idx];
    return authUser;
  }
  return null;
}

export function rejectUser(id: string): AuthUser | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx].status = "rejected";
    saveUsers(users);
    const { passwordHash: _pw, ...authUser } = users[idx];
    return authUser;
  }
  return null;
}

// Keep for backward compat with AdminUsers.tsx
export function approveLender(id: string): AuthUser | null {
  return approveUser(id);
}

export function rejectLender(id: string) {
  rejectUser(id);
}

export function updateProfile(
  id: string,
  updates: { name: string }
): AuthUser | { error: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { error: "User not found." };
  users[idx].name = updates.name.trim();
  if (users[idx].role === "lender") users[idx].institution = updates.name.trim();
  saveUsers(users);
  const { passwordHash: _pw, ...authUser } = users[idx];
  const token = makeToken(authUser);
  localStorage.setItem(TOKEN_KEY, token);
  return authUser;
}

export function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): { success: true } | { error: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { error: "User not found." };
  if (users[idx].passwordHash !== hash(currentPassword))
    return { error: "Current password is incorrect." };
  if (newPassword.length < 8)
    return { error: "New password must be at least 8 characters." };
  users[idx].passwordHash = hash(newPassword);
  saveUsers(users);
  return { success: true };
}
