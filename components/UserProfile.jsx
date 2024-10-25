const UserProfile = ({ user, userHandle }) => (
    <div>
        <img src={user.avatar} alt={`${user.name}'s avatar`} />
        <span>{user.name} @{userHandle}</span>
    </div>
);


export default UserProfile;