import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

const SortButton: React.FC<Props> = ({ orderBy, setOrderBy }) => {
  return (
    <Select value={orderBy} onValueChange={setOrderBy}>
      <SelectTrigger className="h-9 px-3 w-[150px] text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>

          <SelectItem value="createdat">
            Created At (Oldest)
          </SelectItem>

          <SelectItem value="-createdat">
            Created At (Newest)
          </SelectItem>

          <SelectItem value="severity">
            Severity (Low → High)
          </SelectItem>

          <SelectItem value="-severity">
            Severity (High → Low)
          </SelectItem>

          <SelectItem value="category">
            Category (A → Z)
          </SelectItem>

          <SelectItem value="-category">
            Category (Z → A)
          </SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortButton;