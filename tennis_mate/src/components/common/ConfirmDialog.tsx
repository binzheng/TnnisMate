"use client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export function ConfirmDialog({ open, title, content, onClose, onConfirm }: {
  open: boolean;
  title: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-title">
      <DialogTitle id="confirm-title">{title}</DialogTitle>
      {content && (
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} autoFocus>{"キャンセル"}</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>{"OK"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;

