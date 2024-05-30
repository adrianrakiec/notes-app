import styles from './Folder.module.css';
import FolderIcon from '../../assets/folder.svg';

const Folder = ({ children, active, icon }) => {
	return (
		<div
			className={`${styles.folder} ${active ? styles.active : ''}`}
			role='listitem'
		>
			<img src={FolderIcon} />
			{children}
		</div>
	);
};

export { Folder };
