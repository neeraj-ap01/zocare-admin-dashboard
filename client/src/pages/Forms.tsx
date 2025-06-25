import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { FormBuilder } from "@/components/forms/FormBuilder";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  FormInput,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketForm {
  id: string;
  name: string;
  status: "active" | "inactive";
  isDefault?: boolean;
  fieldCount?: number;
  lastModified?: Date;
}

const mockForms: TicketForm[] = [
  {
    id: "1",
    name: "Default Ticket Form",
    status: "active",
    isDefault: true,
    fieldCount: 8,
    lastModified: new Date("2024-06-20"),
  },
  {
    id: "2",
    name: "Bug Report Form",
    status: "active",
    fieldCount: 12,
    lastModified: new Date("2024-06-18"),
  },
  {
    id: "3",
    name: "Feature Request Form",
    status: "inactive",
    fieldCount: 6,
    lastModified: new Date("2024-06-15"),
  },
];

export default function Forms() {
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState<TicketForm[]>(mockForms);
  const [isSaving, setIsSaving] = useState(false);

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeForms = filteredForms.filter((form) => form.status === "active");
  const inactiveForms = filteredForms.filter(
    (form) => form.status === "inactive",
  );

  const handleCreateNewForm = () => {
    setShowFormBuilder(true);
  };

  const handleBackToList = () => {
    setShowFormBuilder(false);
  };

  const handleSaveForm = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Show success message and navigate back
      setShowFormBuilder(false);
      // You can add toast notification here if needed
    } finally {
      setIsSaving(false);
    }
  };

  if (showFormBuilder) {
    return <FormBuilder onBack={handleBackToList} onSave={handleSaveForm} />;
  }

  return (
    <div className="space-responsive">
      <PageHeader
        title="Form Management"
        description="Create and manage ticket submission forms with custom fields and layouts"
        badge={{ text: `${forms.length} forms`, variant: "secondary" }}
        actions={
          <Button
            onClick={handleCreateNewForm}
            className="btn-responsive bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Form</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      {/* Information Alert */}
      <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-responsive-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-foreground">
              Ticket forms determine the fields and data structure for tickets.
              Create multiple forms for different products or use cases.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 h-auto p-0 font-medium self-start sm:self-auto"
            >
              Learn more <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* End User Selection Text */}
      <div className="p-4 sm:p-6 bg-muted/30 rounded-lg border border-border">
        <div className="space-y-2">
          <h3 className="text-responsive-subtitle font-semibold text-foreground">
            End User Form Selection
          </h3>
          <p className="text-responsive-caption text-muted-foreground">
            <span className="font-medium">
              Text shown to end users when multiple forms are available:
            </span>
          </p>
          <p className="text-responsive-body text-foreground font-medium bg-background px-3 py-2 rounded border border-border">
            "Please choose your issue category below"
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-responsive-body bg-background border-border"
          />
        </div>
        <Button variant="outline" className="btn-responsive-sm">
          <Filter className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          <span className="sm:hidden">Filter</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
          <TabsTrigger value="active" className="text-responsive-caption">
            Active ({activeForms.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-responsive-caption">
            Inactive ({inactiveForms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 sm:mt-6">
          {activeForms.length === 0 ? (
            <EmptyState
              icon={FormInput}
              title="No active forms found"
              description={
                searchTerm
                  ? "Try adjusting your search"
                  : "Create your first form to get started"
              }
              action={
                !searchTerm
                  ? {
                      label: "Create Form",
                      onClick: handleCreateNewForm,
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {activeForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={() => setShowFormBuilder(true)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-4 sm:mt-6">
          {inactiveForms.length === 0 ? (
            <EmptyState
              icon={FormInput}
              title="No inactive forms found"
              description={
                searchTerm
                  ? "Try adjusting your search"
                  : "All your forms are currently active"
              }
            />
          ) : (
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {inactiveForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={() => setShowFormBuilder(true)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FormCardProps {
  form: TicketForm;
  onEdit: () => void;
}

function FormCard({ form, onEdit }: FormCardProps) {
  return (
    <div className="group bg-card border border-border rounded-lg hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left content */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FormInput className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-responsive-subtitle font-semibold text-card-foreground truncate">
                  {form.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {form.isDefault && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      Default
                    </Badge>
                  )}
                  <Badge
                    variant={form.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {form.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                {form.fieldCount && <span>{form.fieldCount} fields</span>}
                {form.lastModified && (
                  <span className="hidden sm:inline">•</span>
                )}
                {form.lastModified && (
                  <span>Modified {form.lastModified.toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="btn-responsive-sm"
            >
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Form
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
