import { cn } from "../_lib/utils";

interface titleProps {
  title: string;
  classname?: string;
}

const SectionTitle = ({ title, classname }: titleProps) => {
  return (
    <div className="flex pt-[120px]">
      <h2
        className={cn(
          " text-white lg:text-5xl text-4xl text-center px-4",
          classname,
        )}
      >
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
