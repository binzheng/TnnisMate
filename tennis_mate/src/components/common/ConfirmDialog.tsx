"use client";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";

export function ConfirmDialog({
	open,
	title,
	content,
	onClose,
	onConfirm,
}: {
	open: boolean;
	title: string;
	content?: string;
	onClose: () => void;
	onConfirm: () => void;
}) {
	return (
		<Dialog aria-labelledby="confirm-title" onClose={onClose} open={open}>
			<DialogTitle id="confirm-title">{title}</DialogTitle>
			{content && (
				<DialogContent>
					<Typography>{content}</Typography>
				</DialogContent>
			)}
			<DialogActions>
				<Button autoFocus onClick={onClose}>
					{"キャンセル"}
				</Button>
				<Button color="error" onClick={onConfirm} variant="contained">
					{"OK"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
