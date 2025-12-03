"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { Loader2, Plus, Edit, Trash2, GripVertical, Eye, Save, X } from 'lucide-react';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  important: boolean;
  options?: FieldOption[];
  order: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    customMessage?: string;
  };
  conditional?: {
    fieldKey: string;
    operator: string;
    value: unknown;
  };
  emailRestriction?: 'all' | 'iitp';
  imageFolder?: string;
  maxFileSize?: number;
}

interface Template {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageFileId?: string;
  fields: Field[];
  active: boolean;
  passwordProtected?: boolean;
  password?: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'image', label: 'Image Upload' },
];

const MANDATORY_FIELDS = ['name', 'email', 'phone', 'semester'];

export default function RegistrationBuilder() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/registration-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTemplate = () => {
    const newTemplate: Template = {
      name: '',
      slug: '',
      description: '',
      image: '',
      imageFileId: '',
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', required: true, important: true, order: 0 },
        { key: 'email', label: 'Email', type: 'email', required: true, important: true, order: 1, emailRestriction: 'all' },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: true, important: true, order: 2 },
        { key: 'semester', label: 'Semester', type: 'select', required: true, important: true, order: 3, options: [
          { label: '1st', value: '1' },
          { label: '2nd', value: '2' },
          { label: '3rd', value: '3' },
          { label: '4th', value: '4' },
          { label: '5th', value: '5' },
          { label: '6th', value: '6' },
          { label: '7th', value: '7' },
          { label: '8th', value: '8' },
        ]},
      ],
      active: true
    };
    setCurrentTemplate(newTemplate);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('folder', '/registration-templates');

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return { url: data.url, fileId: data.fileId };
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImage = async (fileId: string) => {
    try {
      await fetch('/api/imagekit/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const saveTemplate = async () => {
    if (!currentTemplate) return;

    if (!currentTemplate.name || !currentTemplate.slug) {
      alert('Please fill in template name and slug');
      return;
    }

    setLoading(true);
    try {
      // Upload new image if selected
      let imageData = null;
      if (imageFile) {
        imageData = await uploadImage();
        if (imageData) {
          // Delete old image if updating
          if (currentTemplate._id && currentTemplate.imageFileId) {
            await deleteImage(currentTemplate.imageFileId);
          }
          currentTemplate.image = imageData.url;
          currentTemplate.imageFileId = imageData.fileId;
        }
      }

      const url = '/api/admin/registration-templates';
      const method = currentTemplate._id ? 'PUT' : 'POST';
      const body = currentTemplate._id 
        ? { id: currentTemplate._id, ...currentTemplate }
        : currentTemplate;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchTemplates();
        setCurrentTemplate(null);
        setImageFile(null);
        setImagePreview('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setLoading(true);
    try {
      // Find template to get imageFileId
      const template = templates.find(t => t._id === id);
      
      const response = await fetch(`/api/admin/registration-templates?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Delete associated image if exists
        if (template?.imageFileId) {
          await deleteImage(template.imageFileId);
        }
        await fetchTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newField: Field = {
      key: '',
      label: '',
      type: 'text',
      required: false,
      important: false,
      order: currentTemplate?.fields.length || 0
    };
    setEditingField(newField);
    setShowFieldEditor(true);
  };

  const editField = (field: Field) => {
    setEditingField({ ...field });
    setShowFieldEditor(true);
  };

  const saveField = () => {
    if (!editingField || !currentTemplate) return;

    if (!editingField.key || !editingField.label) {
      alert('Please fill in field key and label');
      return;
    }

    const existingFieldIndex = currentTemplate.fields.findIndex(f => f.key === editingField.key);
    
    if (existingFieldIndex >= 0) {
      // Update existing field
      const updatedFields = [...currentTemplate.fields];
      updatedFields[existingFieldIndex] = editingField;
      setCurrentTemplate({ ...currentTemplate, fields: updatedFields });
    } else {
      // Add new field
      setCurrentTemplate({
        ...currentTemplate,
        fields: [...currentTemplate.fields, editingField]
      });
    }

    setShowFieldEditor(false);
    setEditingField(null);
  };

  const deleteField = (key: string) => {
    if (!currentTemplate) return;

    if (MANDATORY_FIELDS.includes(key)) {
      alert('Cannot delete mandatory field');
      return;
    }

    setCurrentTemplate({
      ...currentTemplate,
      fields: currentTemplate.fields.filter(f => f.key !== key)
    });
  };

  const onDragEnd = (result: { destination?: { index: number } | null; source: { index: number } }) => {
    if (!result.destination || !currentTemplate) return;

    const items = Array.from(currentTemplate.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedFields = items.map((field, index) => ({
      ...field,
      order: index
    }));

    setCurrentTemplate({ ...currentTemplate, fields: reorderedFields });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registration Form Templates</h2>
        <Button onClick={createNewTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>

      {!currentTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">No templates found. Create one to get started.</p>
          ) : (
            templates.map(template => (
              <Card key={template._id} className="overflow-hidden">
                {template.image && (
                  <div className="relative w-full aspect-video bg-gray-50">
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <p className="text-sm text-gray-500">/{template.slug}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.fields.length} fields</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setCurrentTemplate(template);
                      setImagePreview('');
                      setImageFile(null);
                    }}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => template._id && deleteTemplate(template._id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentTemplate._id ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                  placeholder="Event Registration"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={currentTemplate.slug}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="event-registration"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentTemplate.description || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                placeholder="Brief description of this registration form"
              />
            </div>

            <div>
              <Label htmlFor="image">Form Image (Optional)</Label>
              <div className="mt-2 space-y-4">
                {(imagePreview || currentTemplate.image) && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-50">
                    <Image
                      src={imagePreview || currentTemplate.image || ''}
                      alt="Form image"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        if (currentTemplate.image) {
                          setCurrentTemplate({ ...currentTemplate, image: '', imageFileId: '' });
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {uploadingImage && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image for this form (max 5MB). This will be shown on the form details page.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentTemplate.active}
                  onCheckedChange={(checked) => setCurrentTemplate({ ...currentTemplate, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            {/* Password Protection */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  id="passwordProtected"
                  checked={currentTemplate.passwordProtected || false}
                  onCheckedChange={(checked) => setCurrentTemplate({ 
                    ...currentTemplate, 
                    passwordProtected: checked,
                    password: checked ? currentTemplate.password : undefined
                  })}
                />
                <Label htmlFor="passwordProtected">Password Protected Form</Label>
              </div>
              {currentTemplate.passwordProtected && (
                <div className="pl-8">
                  <Label htmlFor="formPassword">Form Password</Label>
                  <Input
                    id="formPassword"
                    type="text"
                    value={currentTemplate.password || ''}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, password: e.target.value })}
                    placeholder="Enter password for form submission"
                    className="max-w-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Users will need to enter this password to submit the form
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={addField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            {!previewMode ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Fields</h3>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided: DroppableProvided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {currentTemplate.fields
                          .sort((a, b) => a.order - b.order)
                          .map((field, index) => (
                            <Draggable key={field.key} draggableId={field.key} index={index}>
                              {(provided: DraggableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{field.label}</div>
                                    <div className="text-sm text-gray-500">
                                      {field.key} • {field.type}
                                      {field.required && <span className="text-red-500 ml-2">*</span>}
                                      {field.important && <span className="text-yellow-500 ml-2">⚠</span>}
                                      {field.type === 'email' && field.emailRestriction === 'iitp' && (
                                        <span className="ml-2 text-blue-500">@iitp.ac.in only</span>
                                      )}
                                    </div>
                                  </div>
                                  <Button size="sm" variant="ghost" onClick={() => editField(field)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => deleteField(field.key)}
                                    disabled={MANDATORY_FIELDS.includes(field.key)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                {(imagePreview || currentTemplate.image) && (
                  <div className="relative w-full aspect-video bg-gray-100">
                    <Image
                      src={imagePreview || currentTemplate.image || ''}
                      alt={currentTemplate.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{currentTemplate.name}</h3>
                  {currentTemplate.description && (
                    <p className="text-gray-600 mb-6">{currentTemplate.description}</p>
                  )}
                  <div className="space-y-4">
                    {currentTemplate.fields
                      .sort((a, b) => a.order - b.order)
                      .map(field => (
                        <div key={field.key} className="bg-white p-4 rounded border">
                          <Label>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                            {field.important && <span className="text-yellow-500 ml-1">⚠</span>}
                          </Label>
                          <Input 
                            type={field.type} 
                            placeholder={field.placeholder} 
                            disabled 
                            className="mt-2"
                          />
                          {field.type === 'email' && field.emailRestriction === 'iitp' && (
                            <p className="text-xs text-blue-500 mt-1">Only @iitp.ac.in emails accepted</p>
                          )}
                          {field.type === 'image' && (
                            <p className="text-xs text-gray-500 mt-1">Max file size: {field.maxFileSize || 5} MB</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={saveTemplate} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button variant="outline" onClick={() => setCurrentTemplate(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Editor Dialog - Continued in next part */}
      <Dialog open={showFieldEditor} onOpenChange={setShowFieldEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingField?.key ? 'Edit Field' : 'Add Field'}</DialogTitle>
          </DialogHeader>
          {editingField && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fieldKey">Field Key</Label>
                  <Input
                    id="fieldKey"
                    value={editingField.key}
                    onChange={(e) => setEditingField({ ...editingField, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="field_name"
                    disabled={MANDATORY_FIELDS.includes(editingField.key)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier (lowercase, underscores only)</p>
                </div>
                <div>
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select
                    value={editingField.type}
                    onValueChange={(value) => setEditingField({ ...editingField, type: value })}
                  >
                    <SelectTrigger id="fieldType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="fieldLabel">Label / Question Text</Label>
                <Textarea
                  id="fieldLabel"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  placeholder="Enter your question or field label (can be multiple lines)"
                  className="min-h-[60px] resize-y"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">This will be displayed as the question/label for users</p>
              </div>

              <div>
                <Label htmlFor="placeholder">Placeholder Text</Label>
                <Input
                  id="placeholder"
                  value={editingField.placeholder || ''}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  placeholder="Enter placeholder text (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={editingField.required}
                    onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="important"
                    checked={editingField.important}
                    onCheckedChange={(checked) => setEditingField({ ...editingField, important: checked })}
                  />
                  <Label htmlFor="important">Important</Label>
                </div>
              </div>

              {/* Email-specific options */}
              {editingField.type === 'email' && (
                <div>
                  <Label htmlFor="emailRestriction">Email Domain Restriction</Label>
                  <Select
                    value={editingField.emailRestriction || 'all'}
                    onValueChange={(value: 'all' | 'iitp') => setEditingField({ ...editingField, emailRestriction: value })}
                  >
                    <SelectTrigger id="emailRestriction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Email Addresses</SelectItem>
                      <SelectItem value="iitp">Only @iitp.ac.in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Image-specific options */}
              {editingField.type === 'image' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="imageFolder">ImageKit Folder</Label>
                    <Input
                      id="imageFolder"
                      value={editingField.imageFolder || '/registrations'}
                      onChange={(e) => setEditingField({ ...editingField, imageFolder: e.target.value })}
                      placeholder="/registrations"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={editingField.maxFileSize || 5}
                      onChange={(e) => setEditingField({ ...editingField, maxFileSize: parseInt(e.target.value) })}
                      min={1}
                      max={20}
                    />
                  </div>
                </div>
              )}

              {/* Options for select/radio/checkbox */}
              {['select', 'radio', 'checkbox'].includes(editingField.type) && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {(editingField.options || []).map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...(editingField.options || [])];
                            newOptions[index].label = e.target.value;
                            setEditingField({ ...editingField, options: newOptions });
                          }}
                          placeholder="Label"
                        />
                        <Input
                          value={option.value}
                          onChange={(e) => {
                            const newOptions = [...(editingField.options || [])];
                            newOptions[index].value = e.target.value;
                            setEditingField({ ...editingField, options: newOptions });
                          }}
                          placeholder="Value"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newOptions = (editingField.options || []).filter((_, i) => i !== index);
                            setEditingField({ ...editingField, options: newOptions });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = [...(editingField.options || []), { label: '', value: '' }];
                        setEditingField({ ...editingField, options: newOptions });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {/* Conditional Logic */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Conditional Logic (Show/Hide)</h4>
                <p className="text-sm text-gray-500 mb-3">Show this field only when another field meets a condition</p>
                <div className="flex items-center space-x-2 mb-3">
                  <Switch
                    id="enableConditional"
                    checked={!!editingField.conditional}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEditingField({
                          ...editingField,
                          conditional: { fieldKey: '', operator: '==', value: '' }
                        });
                      } else {
                        const { conditional: _conditional, ...rest } = editingField;
                        setEditingField(rest);
                      }
                    }}
                  />
                  <Label htmlFor="enableConditional">Enable Conditional Display</Label>
                </div>
                
                {editingField.conditional && currentTemplate && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <div>
                      <Label>Show this field when</Label>
                      <Select
                        value={editingField.conditional.fieldKey}
                        onValueChange={(value) => setEditingField({
                          ...editingField,
                          conditional: { ...editingField.conditional!, fieldKey: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentTemplate.fields
                            .filter(f => f.key !== editingField.key)
                            .sort((a, b) => a.order - b.order)
                            .map(field => (
                              <SelectItem key={field.key} value={field.key}>
                                {field.label} ({field.key})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Operator</Label>
                        <Select
                          value={editingField.conditional.operator}
                          onValueChange={(value) => setEditingField({
                            ...editingField,
                            conditional: { ...editingField.conditional!, operator: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="==">Equals (==)</SelectItem>
                            <SelectItem value="!=">Not Equals (!=)</SelectItem>
                            <SelectItem value="in">Contains</SelectItem>
                            <SelectItem value="notin">Not Contains</SelectItem>
                            <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                            <SelectItem value="<">Less Than (&lt;)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={String(editingField.conditional.value ?? '')}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            conditional: { ...editingField.conditional!, value: e.target.value }
                          })}
                          placeholder="Enter value to match"
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Example:</strong> Show "Company Name" when "Employment Status" equals "Employed"
                    </p>
                  </div>
                )}
              </div>

              {/* Validation rules */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Validation Rules</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['text', 'textarea', 'email', 'tel', 'url'].includes(editingField.type) && (
                    <>
                      <div>
                        <Label>Min Length</Label>
                        <Input
                          type="number"
                          value={editingField.validation?.minLength || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, minLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Max Length</Label>
                        <Input
                          type="number"
                          value={editingField.validation?.maxLength || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, maxLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                    </>
                  )}
                  {editingField.type === 'number' && (
                    <>
                      <div>
                        <Label>Min Value</Label>
                        <Input
                          type="number"
                          value={editingField.validation?.min || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, min: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Max Value</Label>
                        <Input
                          type="number"
                          value={editingField.validation?.max || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, max: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <Label>Regex Pattern</Label>
                  <Input
                    value={editingField.validation?.pattern || ''}
                    onChange={(e) => setEditingField({
                      ...editingField,
                      validation: { ...editingField.validation, pattern: e.target.value }
                    })}
                    placeholder="^[A-Za-z]+$"
                  />
                </div>
                <div className="mt-4">
                  <Label>Custom Error Message</Label>
                  <Input
                    value={editingField.validation?.customMessage || ''}
                    onChange={(e) => setEditingField({
                      ...editingField,
                      validation: { ...editingField.validation, customMessage: e.target.value }
                    })}
                    placeholder="Please enter a valid value"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldEditor(false)}>
              Cancel
            </Button>
            <Button onClick={saveField}>
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
