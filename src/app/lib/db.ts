export type Visitor = {
  id: string; // School ID or Email
  name: string;
  college: string;
  isBlocked: boolean;
};

export type VisitLog = {
  id: string;
  visitorId: string;
  timestamp: string;
  purpose: string;
};

// Initial mock data
const MOCK_VISITORS: Visitor[] = [
  { id: "2023-0001", name: "John Doe", college: "College of Computing", isBlocked: false },
  { id: "2023-0002", name: "Jane Smith", college: "College of Nursing", isBlocked: false },
  { id: "faculty.doe@neu.edu.ph", name: "Dr. Alice Doe", college: "Faculty of Arts", isBlocked: false },
  { id: "blocked.user@neu.edu.ph", name: "Bob Miller", college: "Business Office", isBlocked: true },
];

const INITIAL_LOGS: VisitLog[] = [
  { id: "1", visitorId: "2023-0001", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), purpose: "reading books" },
  { id: "2", visitorId: "2023-0002", timestamp: new Date(Date.now() - 86400000).toISOString(), purpose: "research for thesis" },
  { id: "3", visitorId: "2023-0001", timestamp: new Date().toISOString(), purpose: "use of computer" },
];

export const getVisitors = (): Visitor[] => {
  if (typeof window === "undefined") return MOCK_VISITORS;
  const saved = localStorage.getItem("neu_visitors");
  if (!saved) {
    localStorage.setItem("neu_visitors", JSON.stringify(MOCK_VISITORS));
    return MOCK_VISITORS;
  }
  return JSON.parse(saved);
};

export const getLogs = (): VisitLog[] => {
  if (typeof window === "undefined") return INITIAL_LOGS;
  const saved = localStorage.getItem("neu_logs");
  if (!saved) {
    localStorage.setItem("neu_logs", JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
  return JSON.parse(saved);
};

export const saveLog = (log: VisitLog) => {
  const current = getLogs();
  localStorage.setItem("neu_logs", JSON.stringify([...current, log]));
};

export const updateVisitorStatus = (visitorId: string, isBlocked: boolean) => {
  const visitors = getVisitors();
  const updated = visitors.map(v => v.id === visitorId ? { ...v, isBlocked } : v);
  localStorage.setItem("neu_visitors", JSON.stringify(updated));
};

export const findVisitor = (id: string): Visitor | undefined => {
  return getVisitors().find(v => v.id.toLowerCase() === id.toLowerCase());
};
