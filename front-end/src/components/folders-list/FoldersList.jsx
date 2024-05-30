import styles from './FoldersList.module.css';
import { Folder } from '../folder/Folder';
import { Title } from '../title/Title';
import { TopBar } from '../top-bar/TopBar';
import { AddNewButton } from '../add-new-button/AddNewButton';
import { Fragment, useState } from 'react';
import {
	NavLink,
	useLoaderData,
	Form,
	redirect,
	useSubmit,
} from 'react-router-dom';
import RemoveIcon from '../../assets/remove.svg';
import { ErrorPopup } from '../error-popup/ErrorPopup';

export async function createFolder(args) {
	const data = await args.request.formData();
	const folderName = data.get('folder-name');

	return fetch(`http://localhost:3000/folders`, {
		method: 'POST',
		body: JSON.stringify({
			name: folderName,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(response => {
			return response.json();
		})
		.then(newFolder => {
			return redirect(`/notes/${newFolder.id}`);
		});
}

export async function deleteFolder({ params }) {
	return fetch(`http://localhost:3000/folders/${params.id}`, {
		method: 'DELETE',
	}).then(() => {
		return redirect('/');
	});
}

const Folders = ({ children }) => (
	<div className={styles['folders-column']}>{children}</div>
);
const UserCreatedFolders = ({ children }) => (
	<div role='list' className={styles['folders-list']}>
		{children}
	</div>
);

const FoldersList = () => {
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState('');
	const folders = useLoaderData();
	const submit = useSubmit();

	const handleSubmit = event => {
		event.preventDefault();
		if (inputValue.trim() === '') {
			setError('Nazwa folderu nie może być pusta!');
			setTimeout(() => setError(''), 1500);
		} else {
			setInputValue('');
			const form = event.target.closest('form');
			submit(form, { action: '/', method: 'POST' });
		}
	};

	return (
		<Folders>
			<TopBar>
				<Form onSubmit={handleSubmit}>
					<input
						className={styles['new-folder-input']}
						type='text'
						placeholder='Nazwa folderu'
						name='folder-name'
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
					/>
					<AddNewButton type='submit'>+</AddNewButton>
					{error && <ErrorPopup>{error}</ErrorPopup>}
				</Form>
			</TopBar>

			<Title>Foldery</Title>
			<UserCreatedFolders>
				{folders.map(folder => (
					<Fragment key={folder.id}>
						<NavLink to={`/notes/${folder.id}`}>
							{({ isActive }) => {
								return <Folder active={isActive}>{folder.name}</Folder>;
							}}
						</NavLink>
						<Form
							method='DELETE'
							action={`/delete/${folder.id}`}
							className={styles['delete-form']}
						>
							<button className={styles['delete-btn']}>
								<img className={styles.image} src={RemoveIcon} />
							</button>
						</Form>
					</Fragment>
				))}
			</UserCreatedFolders>
			<NavLink to='archive'>
				<Folder>Archiwum</Folder>
			</NavLink>
		</Folders>
	);
};

export default FoldersList;
