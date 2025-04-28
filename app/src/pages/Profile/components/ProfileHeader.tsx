
interface ProfileHeaderProps {
  title: string;
  description: string;
}

export const ProfileHeader = ({ title, description }: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#FF8133]">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
