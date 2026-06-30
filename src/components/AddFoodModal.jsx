import { useEffect, useState } from 'react';
import { ImagePlus, UtensilsCrossed, Tag, DollarSign, Check } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

export default function AddFoodModal({ open, onClose, categories, onSubmit, saving }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
      setErrors({});
    }
  }, [open]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Food name is required';
    else if (form.name.trim().length < 2) next.name = 'Name is too short';
    if (!form.price) next.price = 'Price is required';
    else if (Number(form.price) <= 0) next.price = 'Price must be greater than 0';
    if (!form.categoryId) next.categoryId = 'Please select a category';
    if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl)) next.imageUrl = 'Enter a valid URL';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add new food item"
      description="Create a new dish for your store menu."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="add-food-form" loading={saving}>
            {!saving && <Check className="h-4 w-4" />}
            Save item
          </Button>
        </>
      }
    >
      <form id="add-food-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Food name"
          name="name"
          placeholder="e.g. Margherita Pizza"
          icon={UtensilsCrossed}
          value={form.name}
          onChange={update}
          error={errors.name}
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Brief description of the dish, ingredients, or allergens"
            value={form.description}
            onChange={update}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 transition-all focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="12.99"
            icon={DollarSign}
            value={form.price}
            onChange={update}
            error={errors.price}
          />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Category</label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={update}
                className={`w-full appearance-none rounded-xl border bg-white py-2.5 pl-11 pr-9 text-sm text-ink-800 transition-all focus:outline-none focus:ring-4 ${
                  errors.categoryId
                    ? 'border-error-300 focus:border-error-400 focus:ring-error-100'
                    : 'border-ink-200 focus:border-brand-400 focus:ring-brand-100'
                } ${form.categoryId ? 'text-ink-800' : 'text-ink-400'}`}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.categoryId && <p className="mt-1.5 text-xs font-medium text-error-600">{errors.categoryId}</p>}
          </div>
        </div>

        <Input
          label="Image URL"
          name="imageUrl"
          placeholder="https://images.example.com/dish.jpg"
          icon={ImagePlus}
          value={form.imageUrl}
          onChange={update}
          error={errors.imageUrl}
          hint="Paste a direct link to an image of the dish"
        />

        {form.imageUrl && /^https?:\/\//i.test(form.imageUrl) && (
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3 ring-1 ring-ink-100">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <p className="text-xs font-semibold text-ink-700">Image preview</p>
              <p className="text-xs text-ink-500">This image will appear on customer cards.</p>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
