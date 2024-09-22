"use client";

import {  useState } from "react";
import {
  Label,
  Input,
  Textarea,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Dialog,
  DialogContent,
  EyeIcon,
  Copy,
  LockIcon,
  Trash2Icon,
} from "~/components/ui";
import { useToast } from "~/utils/hooks";

export default function Component() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Acme Inc API Key",
      description: "Primary API key for Acme Inc integration",
      createdAt: "2023-04-01",
      status: "active",
    },
    {
      id: "2",
      name: "Legacy API Key",
      description: "Old API key, should be revoked",
      createdAt: "2021-08-15",
      status: "revoked",
    },
    {
      id: "3",
      name: "Development API Key",
      description: "API key for development environment",
      createdAt: "2022-11-30",
      status: "active",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const handleCreateKey = () => {
    const newKey = {
      id: crypto.randomUUID(),
      name: "New API Key",
      description: "Description for new API key",
      createdAt: new Date().toISOString().slice(0, 10),
      status: "active",
    };
    setApiKeys([...apiKeys, newKey]);
  };
  const handleRevokeKey = (id) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "revoked" } : key
      )
    );
  };
  const handleDeleteKey = (id) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };
  const handleViewKey = (key) => {
    setSelectedKey(key);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedKey(null);
  };
  const { toast } = useToast();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">API Key Management</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Create API Key</h2>
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Enter a name" />
          </div>
          <div className="col-span-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter a description" />
          </div>
          <div className="col-span-2">
            <Button onClick={handleCreateKey}>Create API Key</Button>
          </div>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Manage API Keys</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.name}</TableCell>
                <TableCell>{key.description}</TableCell>
                <TableCell>{key.createdAt}</TableCell>
                <TableCell>
                  <Badge
                    variant={key.status === "active" ? "success" : "danger"}>
                    {key.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewKey(key)}>
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">View API Key</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View API Key</TooltipContent>
                      </Tooltip>
                      {key.status === "active" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeKey(key.id)}>
                              <LockIcon className="h-4 w-4" />
                              <span className="sr-only">Revoke API Key</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Revoke API Key</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}>
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete API Key</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete API Key</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <TooltipProvider>
              <div className="bg-primary-foreground text-primary px-4 py-2 rounded-full font-mono text-xl">
                {selectedKey?.id}
              </div>
              <p className="text-lg font-medium">API Key Details</p>
              <div className="grid gap-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{selectedKey?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Description:</span>
                  <span>{selectedKey?.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Created:</span>
                  <span>{selectedKey?.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      selectedKey?.status === "active" ? "success" : "danger"
                    }>
                    {selectedKey?.status}
                  </Badge>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedKey?.id);
                      toast({
                        title: "API Key Copied",
                        description:
                          "The API key has been copied to your clipboard.",
                        variant: "success",
                      });
                    }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy API Key
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy API Key</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

