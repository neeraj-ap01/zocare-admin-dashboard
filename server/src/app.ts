import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

const app = express();

// Security and middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockFields = [
  {
    id: "1",
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: [
      { id: "1", label: "Low", value: "low", color: "#10b981" },
      { id: "2", label: "Medium", value: "medium", color: "#f59e0b" },
      { id: "3", label: "High", value: "high", color: "#ef4444" },
    ],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "due_date",
    label: "Due Date",
    type: "date",
    required: false,
    isActive: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

const mockStats = {
  totalFields: 4,
  activeForms: 3,
  teamMembers: 4,
  activeGroups: 3,
  totalTags: 5,
  customViews: 3,
};

const mockActivity = [
  {
    id: "1",
    action: "Field created",
    description: "Priority field was created by John Doe",
    time: "2 minutes ago",
    type: "field",
  },
  {
    id: "2",
    action: "Form updated",
    description: "Support Ticket Form was modified",
    time: "15 minutes ago",
    type: "form",
  },
];

// API Routes
app.get("/", (req, res) => {
  res.json({
    name: "ZoCare Dashboard BFF",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Dashboard routes
app.get("/api/v1/dashboard/stats", (req, res) => {
  res.json({
    status: "success",
    data: mockStats,
  });
});

app.get("/api/v1/dashboard/activity", (req, res) => {
  res.json({
    status: "success",
    data: mockActivity,
  });
});

app.get("/api/v1/dashboard/overview", (req, res) => {
  res.json({
    status: "success",
    data: {
      stats: mockStats,
      recentActivity: mockActivity,
      health: { status: "healthy" },
      quickActions: [],
    },
  });
});

// Fields routes
app.get("/api/v1/fields", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  res.json({
    status: "success",
    data: {
      data: mockFields,
      pagination: {
        page,
        limit,
        total: mockFields.length,
        totalPages: Math.ceil(mockFields.length / limit),
      },
    },
  });
});

app.get("/api/v1/fields/:id", (req, res) => {
  const field = mockFields.find((f) => f.id === req.params.id);
  if (!field) {
    return res.status(404).json({
      status: "error",
      message: "Field not found",
    });
  }
  res.json({
    status: "success",
    data: field,
  });
});

app.post("/api/v1/fields", (req, res) => {
  const newField = {
    id: (mockFields.length + 1).toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockFields.push(newField);

  res.status(201).json({
    status: "success",
    data: newField,
  });
});

app.put("/api/v1/fields/:id", (req, res) => {
  const fieldIndex = mockFields.findIndex((f) => f.id === req.params.id);
  if (fieldIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Field not found",
    });
  }

  mockFields[fieldIndex] = {
    ...mockFields[fieldIndex],
    ...req.body,
    updatedAt: new Date(),
  };

  res.json({
    status: "success",
    data: mockFields[fieldIndex],
  });
});

app.delete("/api/v1/fields/:id", (req, res) => {
  const fieldIndex = mockFields.findIndex((f) => f.id === req.params.id);
  if (fieldIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Field not found",
    });
  }

  mockFields.splice(fieldIndex, 1);
  res.status(204).send();
});

// Placeholder routes for other entities
app.get("/api/v1/users", (req, res) => {
  res.json({
    status: "success",
    data: {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    },
  });
});

app.get("/api/v1/forms", (req, res) => {
  res.json({
    status: "success",
    data: {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    },
  });
});

app.get("/api/v1/groups", (req, res) => {
  res.json({
    status: "success",
    data: {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    },
  });
});

app.get("/api/v1/tags", (req, res) => {
  res.json({
    status: "success",
    data: {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    },
  });
});

app.get("/api/v1/views", (req, res) => {
  res.json({
    status: "success",
    data: {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    },
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use((error: any, req: any, res: any, next: any) => {
  console.error("Server error:", error);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(
    `🚀 ZoCare Dashboard BFF Server started at http://${HOST}:${PORT}`,
  );
});

export default app;
