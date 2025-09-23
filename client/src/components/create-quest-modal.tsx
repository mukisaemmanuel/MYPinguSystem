import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertQuestSchema, type Quest } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  editQuest?: Quest | null;
}

const createQuestSchema = insertQuestSchema.omit({ 
  userId: true, 
  status: true 
}).extend({
  xp: z.number().min(1, "XP must be at least 1").max(1000, "XP cannot exceed 1000"),
});

type CreateQuestFormData = z.infer<typeof createQuestSchema>;

const categories = ["Health", "Work", "Personal", "Study"];

export default function CreateQuestModal({ isOpen, onClose, editQuest }: CreateQuestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateQuestFormData>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      xp: 20,
      timeEstimate: "",
      category: "Health",
    },
  });

  // Reset form when editQuest changes or modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: editQuest?.title || "",
        description: editQuest?.description || "",
        xp: editQuest?.xp || 20,
        timeEstimate: editQuest?.timeEstimate || "",
        category: editQuest?.category || "Health",
      });
    }
  }, [editQuest, isOpen, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: CreateQuestFormData) => {
      if (editQuest) {
        return apiRequest("PATCH", `/api/quests/${editQuest.id}`, data);
      } else {
        return apiRequest("POST", "/api/quests", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: editQuest ? "Quest Updated! ⚙️" : "Quest Created! ⚔️",
        description: editQuest 
          ? "Your quest has been updated successfully." 
          : "Your new quest has been added to your adventure.",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editQuest ? 'update' : 'create'} quest. Please try again.`,
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: CreateQuestFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border" data-testid="modal-create-quest">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editQuest ? "Edit Quest" : "Create New Quest"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quest Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter quest name..." 
                      {...field}
                      className="bg-input border-border"
                      data-testid="input-quest-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your quest..." 
                      {...field}
                      value={field.value || ""}
                      className="bg-input border-border h-20 resize-none"
                      data-testid="textarea-quest-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="xp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XP Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="20"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="bg-input border-border"
                        data-testid="input-quest-xp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="30 min" 
                        {...field}
                        value={field.value || ""}
                        className="bg-input border-border"
                        data-testid="input-quest-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border" data-testid="select-quest-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel-quest"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-submit-quest"
              >
                {saveMutation.isPending 
                  ? (editQuest ? "Updating..." : "Creating...") 
                  : (editQuest ? "Update Quest" : "Create Quest")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
