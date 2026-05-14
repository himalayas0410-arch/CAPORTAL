const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9999,
    priceLabel: "₹9,999",
    validity: "1 Year",
    features: [
      "Excel upload (up to 5,000 GSTIN/month)",
      "Bulk GSTIN status check",
      "Excel report download",
      "Email support",
      "1 simultaneous user",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 19999,
    priceLabel: "₹19,999",
    validity: "1 Year",
    features: [
      "Excel upload (up to 25,000 GSTIN/month)",
      "Bulk GSTIN status check",
      "Excel report download",
      "Email & SMS alerts",
      "Priority support",
      "2 simultaneous users",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceLabel: "Custom",
    validity: "Custom",
    features: [
      "Unlimited GSTIN verification",
      "Dedicated account manager",
      "API access (on request)",
      "Custom SLA",
      "Unlimited simultaneous users",
    ],
  },
];

const MOCK_USER = {
  name: "Rahul Sharma",
  company: "ABC Traders Pvt Ltd",
  email: "demo@gstinportal.com",
  mobile: "9876543210",
  gstin: "09ABCDE1234F1Z5",
  address: "12 Industrial Area, Sector 4",
  city: "Noida",
  state: "Uttar Pradesh",
  pincode: "201301",
  plan: "Professional",
  status: "Active",
  startDate: "14 May 2026",
  expiryDate: "13 May 2027",
  activeUsers: 1,
  maxUsers: 2,
};

const MOCK_REPORTS = [
  { id: "RPT-1001", fileName: "vendor-gstin-list.xlsx", date: "14 May 2026", total: 250, active: 220, cancelled: 18, invalid: 12, status: "Completed" },
  { id: "RPT-1002", fileName: "supplier-list.xlsx", date: "13 May 2026", total: 120, active: 110, cancelled: 6, invalid: 4, status: "Completed" },
  { id: "RPT-1003", fileName: "client-master.xlsx", date: "12 May 2026", total: 80, active: 0, cancelled: 0, invalid: 0, status: "Failed" },
  { id: "RPT-1004", fileName: "q1-vendors.xlsx", date: "08 May 2026", total: 432, active: 402, cancelled: 21, invalid: 9, status: "Completed" },
];

const MOCK_GSTIN_RESULTS = [
  { sr: 1, gstin: "09ABCDE1234F1Z5", legalName: "ABC Pvt Ltd", tradeName: "ABC Traders", status: "Active", state: "Uttar Pradesh", remarks: "Verified" },
  { sr: 2, gstin: "07ABCDE1234F1Z2", legalName: "XYZ Ltd", tradeName: "XYZ Services", status: "Cancelled", state: "Delhi", remarks: "GSTIN Cancelled" },
  { sr: 3, gstin: "27ABCDE1234F1Z8", legalName: "—", tradeName: "—", status: "Invalid", state: "—", remarks: "Invalid Format" },
  { sr: 4, gstin: "29ABCDE5678G2H1", legalName: "Karnataka Foods Pvt Ltd", tradeName: "KFoods", status: "Active", state: "Karnataka", remarks: "Verified" },
  { sr: 5, gstin: "06ABCDE9012K3M5", legalName: "Haryana Steel Co", tradeName: "HSC", status: "Suspended", state: "Haryana", remarks: "Suspended by dept." },
  { sr: 6, gstin: "33ABCDE3344L4N6", legalName: "Tamil Trade House", tradeName: "TTH", status: "Active", state: "Tamil Nadu", remarks: "Verified" },
  { sr: 7, gstin: "19ABCDE5566P5Q7", legalName: "Bengal Exports", tradeName: "BE Exports", status: "Active", state: "West Bengal", remarks: "Verified" },
  { sr: 8, gstin: "24ABCDE7788R6S8", legalName: "Gujarat Polymers", tradeName: "GP Ltd", status: "Cancelled", state: "Gujarat", remarks: "Cancelled by taxpayer" },
];

const MOCK_PAYMENTS = [
  { receipt: "GST-REC-2026-001", date: "14 May 2026", plan: "Professional", amount: "₹19,999", status: "Paid" },
  { receipt: "GST-REC-2025-014", date: "14 May 2025", plan: "Basic", amount: "₹9,999", status: "Paid" },
];

const MOCK_SUBSCRIBERS = [
  { id: "SUB-1001", name: "Rahul Sharma", company: "ABC Traders Pvt Ltd", email: "rahul@abc.com", plan: "Professional", status: "Active", expiry: "13 May 2027" },
  { id: "SUB-1002", name: "Neha Gupta", company: "XYZ Traders", email: "neha@xyz.com", plan: "Basic", status: "Expired", expiry: "10 May 2026" },
  { id: "SUB-1003", name: "Anil Verma", company: "Verma & Co", email: "anil@verma.in", plan: "Professional", status: "Active", expiry: "01 Jan 2027" },
  { id: "SUB-1004", name: "Priya Singh", company: "Singh Logistics", email: "priya@singhlog.com", plan: "Enterprise", status: "Active", expiry: "30 Sep 2027" },
  { id: "SUB-1005", name: "Vikram Joshi", company: "Joshi CA Firm", email: "vikram@joshica.in", plan: "Basic", status: "Trial", expiry: "20 May 2026" },
];

const ADMIN_STATS = {
  totalSubscribers: 142,
  activeSubscriptions: 118,
  expiredSubscriptions: 24,
  totalRevenue: "₹26,84,000",
  totalGstinChecked: 184350,
  apiCalls: 215402,
};
