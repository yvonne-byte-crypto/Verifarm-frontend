import { useEffect, useRef, useState } from "react";

export interface LiveEvent {
  type:       "loan_application" | "repayment" | "score_update";
  phone:      string;
  amount?:    number;
  reference?: string;
  score?:     number;
  lang:       string;
  ts:         string;
}

const USSD_SERVER = import.meta.env.VITE_USSD_SERVER_URL ?? "http://localhost:3000";
const MAX_EVENTS  = 8;

export function useLiveApplications() {
  const [events,    setEvents]    = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    function connect() {
      const es = new EventSource(`${USSD_SERVER}/events`);
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const event: LiveEvent = JSON.parse(e.data);
          setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
        } catch { /* skip malformed events */ }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 5 seconds
        setTimeout(connect, 5_000);
      };
    }

    connect();
    return () => {
      esRef.current?.close();
      setConnected(false);
    };
  }, []);

  return { events, connected };
}
