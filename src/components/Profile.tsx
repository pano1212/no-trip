export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="rounded-b-4xl bg-primary px-6 pt-12 pb-8 text-white shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile"
            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
          />

          <h1 className="mt-4 text-2xl font-bold">John Doe</h1>

          <p className="mt-1 text-sm text-white/80">
            Adventure Traveler ✈️
          </p>

          <button className="mt-5 rounded-full bg-white px-5 py-2 font-medium text-primary transition hover:scale-105">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-4 rounded-t-4xl bg-white px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="mt-1 text-sm text-gray-500">Trips</p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">18</p>
            <p className="mt-1 text-sm text-gray-500">Countries</p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">156</p>
            <p className="mt-1 text-sm text-gray-500">Photos</p>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-8 space-y-3">
          <ProfileItem title="My Trips" icon="🧳" />
          <ProfileItem title="Saved Places" icon="📍" />
          <ProfileItem title="Travel History" icon="🌎" />
          <ProfileItem title="Notifications" icon="🔔" />
          <ProfileItem title="Settings" icon="⚙️" />
          <ProfileItem title="Help Center" icon="❓" />
        </div>

        {/* Logout */}
        <button className="mt-10 w-full rounded-2xl border border-red-200 py-3 font-semibold text-red-500 transition hover:bg-red-50">
          Log Out
        </button>
      </div>
    </div>
  );
}

function ProfileItem({
  title,
  icon,
}: {
  title: string;
  icon: string;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
          {icon}
        </div>

        <span className="font-medium text-gray-800">{title}</span>
      </div>

      <span className="text-gray-400">›</span>
    </button>
  );
}