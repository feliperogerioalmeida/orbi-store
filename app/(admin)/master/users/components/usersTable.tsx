interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  simulations?: SimulationProps[] | null;
  reviews?: ReviewProps[] | null;
}

interface SimulationProps {
  id: string;
  model: string;
  color: string;
  capacity: string;
  batteryHealth: string;
  issues: string;
  estimatedValue: number;
  createdAt: Date;
}

interface ReviewProps {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

const UsersTable = ({ users }: { users: UserProps[] }) => {
  return (
    <div>
      {users.map((user) => (
        <h1 key={user.id}>{user.email}</h1>
      ))}
    </div>
  );
};

export default UsersTable;
