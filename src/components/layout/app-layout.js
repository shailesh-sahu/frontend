import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Paper,
} from "@mui/material";
import { useUser } from "../../context/user-context";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { BooksList } from "../books-list/books-list";
import { LoginDialog } from "../login/login-dialog";
import { BookForm } from "../book-form/book-form";
import { Book } from "../book/book";
import { WithLoginProtector } from "../access-control/login-protector";
import { WithAdminProtector } from "../access-control/admin-protector";

export const AppLayout = () => {
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { user, loginUser, logoutUser, isAdmin } = useUser();
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLoginSubmit = (username, password) => {
        loginUser(username, password);
        setOpenLoginDialog(false);
    };

    const handleLoginClose = () => {
        setOpenLoginDialog(false);
    };

    const handleLogout = () => {
        logoutUser();
        handleCloseUserMenu();
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else if (isAdmin) {
            navigate("/admin/books/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAdmin]);

    const backgroundStyles = {
        backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Library background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        borderRadius: "12px",
    };

    return (
        <Box sx={{ ...backgroundStyles, display: "flex", flexDirection: "column" }}>
            {/* AppBar */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "#000000", // Black
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    borderRadius: "12px",
                    margin: "0px",
                    height: "80px", // Increased height for a larger header
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Updated Modern Logo */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="50"
                            viewBox="0 0 24 24"
                            width="50"
                            fill="#FFFDF2"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 4v16h12V4H6zm7 11h-4v-2h4v2zm3-4H8V9h8v2z" />
                        </svg>

                        <Link
                            to="/"
                            style={{
                                textDecoration: "none",
                                flexGrow: 1,
                                marginLeft: "16px",
                            }}
                        >
                            <Typography
                                variant="h4" // Increased font size for larger header text
                                noWrap
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "#FFFDF2", // Cream
                                    textTransform: "uppercase",
                                }}
                            >
                                Library Management
                            </Typography>
                        </Link>

                        <Box sx={{ flexGrow: 0 }}>
                            {user ? (
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            sx={{
                                                p: 0,
                                                border: "2px solid #FFFDF2",
                                                transition: "all 0.3s ease",
                                                "&:hover": { borderColor: "#FFD700" },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#FFD700", // Gold
                                                    color: "#000000", // Black
                                                }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "45px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">Dashboard</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <Typography textAlign="center">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setOpenLoginDialog(true)}
                                    sx={{
                                        color: "#000000", // Black
                                        bgcolor: "#FFFDF2", // Cream
                                        "&:hover": { bgcolor: "#FFD700" },
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Container
                maxWidth="lg"
                sx={{
                    mt: 4,
                    mb: 4,
                    p: 3,
                    background: "rgba(255, 255, 242, 0.75)", // Cream with transparency
                    borderRadius: "16px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                }}
            >
                <Routes>
                    <Route path="/books" exact element={<BooksList />} />
                    <Route
                        path="/books/:bookIsbn"
                        element={
                            <WithLoginProtector>
                                <Book />
                            </WithLoginProtector>
                        }
                    />
                    <Route
                        path="/admin/books/add"
                        element={
                            <WithLoginProtector>
                                <WithAdminProtector>
                                    <BookForm />
                                </WithAdminProtector>
                            </WithLoginProtector>
                        }
                        exact
                    />
                    <Route
                        path="/admin/books/:bookIsbn/edit"
                        element={
                            <WithLoginProtector>
                                <WithAdminProtector>
                                    <BookForm />
                                </WithAdminProtector>
                            </WithLoginProtector>
                        }
                    />
                    <Route path="*" element={<Navigate to="/books" replace />} />
                </Routes>
            </Container>

            {/* Footer */}
            <Paper
                elevation={3}
                sx={{
                    textAlign: "center",
                    py: 2,
                    backgroundColor: "#000000", // Black
                    color: "#FFFDF2", // Cream
                    borderRadius: "12px",
                    margin: "0px",
                }}
            >
                <Typography variant="body1">@Made by Shailesh Kumar Sahu with ❤️</Typography>
                <Typography variant="body1">© 2025</Typography>
            </Paper>

            <LoginDialog
                open={openLoginDialog}
                handleSubmit={handleLoginSubmit}
                handleClose={handleLoginClose}
            />
        </Box>
    );
};
