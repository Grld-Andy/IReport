import { Input } from "./input";
import { CiSearch } from "react-icons/ci";

const SearchInput = () => {
  return (
    <div className="bg-white rounded-full p-2 flex gap-2 items-center w-full max-w-[500px]">
      <CiSearch size={25} />
      <Input
        placeholder="Search Incident"
        className="shadow-none active:ring-transparent focus-visible:ring-none focus-visible:ring-transparent active:border-none border-none outline-none"
      />
    </div>
  );
};

export default SearchInput;
