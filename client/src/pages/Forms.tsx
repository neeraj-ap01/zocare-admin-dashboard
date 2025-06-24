import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormBuilder } from "@/components/forms/FormBuilder";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketForm {
  id: string;
  name: string;
  status: "active" | "inactive";
  isDefault?: boolean;
}

const mockForms: TicketForm[] = [
  {
    id: "1",
    name: "Default Ticket Form",
    status: "active",
    isDefault: true,
  },
];

export default function Forms() {
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState<TicketForm[]>(mockForms);

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

  if (showFormBuilder) {
    return <FormBuilder onBack={handleBackToList} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Ticket forms</h1>
            <p className="text-gray-600 mt-1">
              A ticket form determines the fields and data a ticket contains.
              Ticket forms can include system fields and any custom fields you
              create.
            </p>
          </div>
          <Button
            onClick={handleCreateNewForm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add form
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            You can create multiple ticket forms for different products, so that
            users across different products: in-that case, end users choose the
            appropriate forms when submitting.{" "}
            <a href="#" className="text-blue-600 underline">
              Learn more
            </a>
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <strong>
            Test shown to end users when multiple forms are available
          </strong>
          <p>Please choose your issue below</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search ticket forms"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {activeForms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active forms found</p>
              </div>
            ) : (
              activeForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={() => setShowFormBuilder(true)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="space-y-4">
            {inactiveForms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No inactive forms found</p>
              </div>
            ) : (
              inactiveForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={() => setShowFormBuilder(true)}
                />
              ))
            )}
          </div>
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
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {form.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{form.name}</h3>
              {form.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
