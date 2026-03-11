import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const FilterButton = () => {
  return (
    <Select>
      <SelectTrigger className="h-9 px-3 w-min text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order</SelectLabel>
          <SelectItem value="all">Date Created</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterButton;
