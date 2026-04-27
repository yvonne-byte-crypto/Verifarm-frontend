export type UserRole = "admin" | "lender" | "agent";
export type UserStatus = "active" | "pending" | "rejected";

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
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

const USERS_KEY = "verifarm_users";
const TOKEN_KEY = "verifarm_token";

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
}): { success: true } | { error: string } {
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
    passwordHash: hash(data.password),
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return parseToken(token);
}

export function getAllLenders(): AuthUser[] {
  return getUsers()
    .filter((u) => u.role === "lender")
    .map(({ passwordHash: _pw, ...u }) => u);
}

export function approveLender(id: string) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx].status = "active";
    saveUsers(users);
  }
}

export function rejectLender(id: string) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    users[idx].status = "rejected";
    saveUsers(users);
  }
}
