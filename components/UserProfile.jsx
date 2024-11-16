import styles from "./Tweet.module.css"

const UserProfile = ({ user, userHandle }) => (
    <div className={styles.Photo}>
        <img src={`${user.picture}`} alt={`${user.name}'s avatar`} style={{borderRadius:'50px', width:'50px', height:'50px' }}/>
        <div className={styles.Nombre}>
            <span>{user.name}</span> 
            <span>@{userHandle}</span>
        </div>
    </div>
);


export default UserProfile;