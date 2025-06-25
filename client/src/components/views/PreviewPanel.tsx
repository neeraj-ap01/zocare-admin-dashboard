import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Eye, Users, Calendar, User } from "lucide-react";
import { FilterCondition } from "@/types";

interface PreviewPanelProps {
  conditions: {
    allConditions: FilterCondition[];
    anyConditions: FilterCondition[];
  };
  columns: Array<{ id: string; label: string; type: string }>;
  groupBy: string;
  orderBy: string;
  sortDirection: "asc" | "desc";
}

interface MockTicket {
  id: string;
  subject: string;
  requester: string;
  requested: string;
  status: string;
  assignee: string;
  priority: string;
  satisfaction?: string;
}

// Mock ticket data for preview
const MOCK_TICKETS: MockTicket[] = [
  {
    id: "1",
    subject: "Property Issues: Common area",
    requester: "Zolostays Expresso",
    requested: "Jun 25",
    status: "Open",
    assignee: "Paulson K P",
    priority: "High",
    satisfaction: "Good",
  },
  {
    id: "2",
    subject: "Property Issues: Common area",
    requester: "Sandeep Adhikari",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "Medium",
    satisfaction: "",
  },
  {
    id: "3",
    subject: "Repair & Maintenance: Bathroom",
    requester: "M shiva",
    requested: "Jun 25",
    status: "Open",
    assignee: "Paulson K P",
    priority: "High",
    satisfaction: "Excellent",
  },
  {
    id: "4",
    subject: "Repair & Maintenance: Room: ...",
    requester: "Gaurav Yadav",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "Medium",
    satisfaction: "",
  },
  {
    id: "5",
    subject: "SH: Service Requests: Income...",
    requester: "RADHIKA GUPTA",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "Low",
    satisfaction: "",
  },
  {
    id: "6",
    subject: "Service-Complaints: Behaviour...",
    requester: "Bhanu Prakash",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "High",
    satisfaction: "",
  },
  {
    id: "7",
    subject: "Repair & Maintenance: Equipment...",
    requester: "Harsh Patel",
    requested: "Jun 25",
    status: "Open",
    assignee: "Paulson K P",
    priority: "Medium",
    satisfaction: "Good",
  },
  {
    id: "8",
    subject: "Notice Related Requests: Noti...",
    requester: "Prabhat",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "Low",
    satisfaction: "",
  },
  {
    id: "9",
    subject: "Exit: Exit charge clarification",
    requester: "Vignesh Hariharan",
    requested: "Jun 25",
    status: "New",
    assignee: "-",
    priority: "Medium",
    satisfaction: "",
  },
  {
    id: "10",
    subject: "Repair & Maintenance: Equipment...",
    requester: "Harsh Patel",
    requested: "Jun 25",
    status: "Open",
    assignee: "Paulson K P",
    priority: "High",
    satisfaction: "Good",
  },
];

export function PreviewPanel({
  conditions,
  columns,
  groupBy,
  orderBy,
  sortDirection,
}: PreviewPanelProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<MockTicket[]>([]);
  const [matchingCount, setMatchingCount] = useState(0);

  const hasConditions =
    conditions.allConditions.length > 0 || conditions.anyConditions.length > 0;

  const isPreviewDisabled = !hasConditions || columns.length === 0;

  const generatePreview = () => {
    if (isPreviewDisabled) return;

    // Simulate filtering based on conditions
    let filteredTickets = [...MOCK_TICKETS];

    // Mock filtering logic - in real app this would call API
    if (
      conditions.allConditions.length > 0 ||
      conditions.anyConditions.length > 0
    ) {
      // For demo, just show a subset based on some mock conditions
      filteredTickets = MOCK_TICKETS.slice(0, 10);
    }

    // Mock sorting
    if (orderBy && filteredTickets.length > 0) {
      filteredTickets.sort((a, b) => {
        const aVal = a[orderBy as keyof MockTicket] || "";
        const bVal = b[orderBy as keyof MockTicket] || "";
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    setMatchingCount(155175); // Mock total count
    setPreviewData(filteredTickets);
    setIsPreviewOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "default";
      case "new":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const renderCellContent = (ticket: MockTicket, columnId: string) => {
    switch (columnId) {
      case "subject":
        return (
          <div className="max-w-[200px] truncate">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
              {ticket.subject}
            </span>
          </div>
        );
      case "status":
        return (
          <Badge variant={getStatusBadgeVariant(ticket.status)}>
            {ticket.status}
          </Badge>
        );
      case "assignee":
        return ticket.assignee === "-" ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {ticket.assignee}
          </div>
        );
      case "requester":
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {ticket.requester}
          </div>
        );
      case "requested":
      case "request_date":
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {ticket.requested}
          </div>
        );
      case "satisfaction":
        return ticket.satisfaction ? (
          <Badge variant="outline">{ticket.satisfaction}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      default:
        return ticket[columnId as keyof MockTicket] || "-";
    }
  };

  if (isPreviewOpen) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Preview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                A sneak peek at how your conditions might work together to
                filter tickets.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                {matchingCount.toLocaleString()} tickets match your conditions
              </p>
              <p className="text-sm text-muted-foreground">
                Preview shows a maximum of 15 tickets with matching conditions.
              </p>
            </div>
            <Button variant="outline" onClick={generatePreview} size="sm">
              Refresh Preview
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {columns.map((column) => (
                    <TableHead key={column.id} className="font-medium">
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-muted/30">
                    {columns.map((column) => (
                      <TableCell key={column.id} className="py-3">
                        {renderCellContent(ticket, column.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-base">Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          A sneak peek at how your conditions might work together to filter
          tickets.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPreviewDisabled && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You need to add at least one{" "}
              <span className="font-medium">All</span> condition for Assignee,
              Group, Requester, Status, or Type
            </AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          onClick={generatePreview}
          className="w-full"
          disabled={isPreviewDisabled}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </CardContent>
    </Card>
  );
}
