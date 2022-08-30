import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MDBInput, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBBadge, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Controller, useForm } from "react-hook-form";
import { deleteProject, getProject } from "src/app/services/ProjectService";
import { createTitle, deleteTitle, getCurrentTitle, getTitle, getVersionTitle } from "src/app/services/TitleService";
import { createProblem, deleteProblem, getCurrentProblems, getProblems, getVersionProblems } from "src/app/services/ProblemService";
import { createHypothesis, deleteHypothesis, getCurrentHypothesis, getHypothesis, getVersionHypothesis } from "src/app/services/HypothesisService";
import { createObjective, deleteObjective, getCurrentObjectives, getObjectives, getVersionObjectives } from "src/app/services/ObjectiveService";
import { createProjectVersion, getProjectByStatus, getProjectVersion, getProjectVersions, updateProjectVersion, deleteProjectVersion } from "src/app/services/ProjectVersionService";
import { styled } from '@mui/material/styles';
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Button, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import RefreshIcon from "@mui/icons-material/Refresh"
import DeleteIcon from "@mui/icons-material/Delete"
import Root from "../../Root";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const initialState = {
    id: "",
    version: "",
    description: "",
    date: "",
    status: 2
};

ReactModal.setAppElement('#root');
const MySwal = withReactContent(Swal);

const ProjectVersions = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [project, setProject] = useState();
    const [variables, setVariables] = useState([]);
    const [projectVersions, setProjectVersions] = useState([]);

    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const projectVersion = watch();

    const getProjectById = async (projectId) => {
        const doc = await getProject(projectId);
        setProject({ ...doc.data() });
        return doc.data();
    };

    const getAllProjectVersions = async (projectId) => {
        const querySnapshot = await getProjectVersions(projectId);
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), date: doc.data().date.toDate().toLocaleString(), id: doc.id });
        });
        setProjectVersions(docs);
    }

    const saveProjectVersion = async (data, e) => {
        projectVersions.forEach(async (version) => {
            await updateProjectVersion(version.id, {
                status: 1
            });
        });

        await createProjectVersion({
            version: data.version,
            description: data.description,
            project_id: params.id,
            date: new Date(),
            status: 2
        });

        var querySnapshot = await getProjectByStatus(params.id, 2);
        var docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        if (docs.length > 0) {
            var projectVersionId = docs[0].id;
            querySnapshot = await getCurrentProjectVariables(params.id);
            querySnapshot.forEach(async (doc) => {
                await createProjectVariable({ ...doc.data(), project_version_id: projectVersionId });
            });
            querySnapshot = await getCurrentTitle(params.id);
            querySnapshot.forEach(async (doc) => {
                await createTitle({ ...doc.data(), project_version_id: projectVersionId });
            });
            querySnapshot = await getCurrentProblems(params.id);
            querySnapshot.forEach(async (doc) => {
                await createProblem({ ...doc.data(), project_version_id: projectVersionId });
            });
            querySnapshot = await getCurrentHypothesis(params.id);
            querySnapshot.forEach(async (doc) => {
                await createHypothesis({ ...doc.data(), project_version_id: projectVersionId });
            });
            querySnapshot = await getCurrentObjectives(params.id);
            querySnapshot.forEach(async (doc) => {
                await createObjective({ ...doc.data(), project_version_id: projectVersionId });
            });
        }

        toggleModal();
        reset(initialState);
        await getAllProjectVersions(params.id);
        dispatch(
            showMessage({
                message: 'Cambios guardados',
                variant: 'success'
            })
        );
    }

    const onRollbackProjectVersion = (projectVersionId) => {
        MySwal.fire({
            title: <p>¿Está Seguro?</p>,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                var querySnapshot = await getCurrentProjectVariables(params.id);
                querySnapshot.forEach(async (doc) => {
                    await deleteProjectVariable(doc.id);
                });
                querySnapshot = await getVersionProjectVariables(params.id, projectVersionId);
                querySnapshot.forEach(async (doc) => {
                    await createProjectVariable({ ...doc.data(), project_version_id: "" });
                });

                var querySnapshot = await getCurrentTitle(params.id);
                querySnapshot.forEach(async (doc) => {
                    await deleteTitle(doc.id);
                });
                querySnapshot = await getVersionTitle(params.id, projectVersionId);
                querySnapshot.forEach(async (doc) => {
                    await createTitle({ ...doc.data(), project_version_id: projectVersionId });
                });

                var querySnapshot = await getCurrentProblems(params.id);
                querySnapshot.forEach(async (doc) => {
                    await deleteProblem(doc.id);
                });
                querySnapshot = await getVersionProblems(params.id, projectVersionId);
                querySnapshot.forEach(async (doc) => {
                    await createProblem({ ...doc.data(), project_version_id: projectVersionId });
                });

                var querySnapshot = await getCurrentHypothesis(params.id);
                querySnapshot.forEach(async (doc) => {
                    await deleteHypothesis(doc.id);
                });
                querySnapshot = await getVersionHypothesis(params.id, projectVersionId);
                querySnapshot.forEach(async (doc) => {
                    await createHypothesis({ ...doc.data(), project_version_id: projectVersionId });
                });

                var querySnapshot = await getCurrentObjectives(params.id);
                querySnapshot.forEach(async (doc) => {
                    await deleteObjective(doc.id);
                });
                querySnapshot = await getVersionObjectives(params.id, projectVersionId);
                querySnapshot.forEach(async (doc) => {
                    await createObjective({ ...doc.data(), project_version_id: projectVersionId });
                });

                dispatch(
                    showMessage({
                        message: 'Cambios guardados',
                        variant: 'success'
                    })
                );
            }
        });
    }

    const onConfirmDeleteProjectVersion = async (projectVersionId) => {
        MySwal.fire({
            title: <p>¿Está Seguro?</p>,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteProjectVersion(projectVersionId);
                dispatch(
                    showMessage({
                        message: 'Cambios guardados',
                        variant: 'success'
                    })
                );
                await getAllProjectVersions(params.id);
            }
        });
    };

    useEffect(() => {
        getProjectById(params.id).then((value) => {
            getAllProjectVersions(params.id);
        });
    }, []);

    const toggleModal = () => {
        setIsOpen(!modalIsOpen);
    }

    return (
        <>
            <Modal
                keepMounted
                open={modalIsOpen}
                onClose={toggleModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <form onSubmit={handleSubmit(saveProjectVersion)}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            {projectVersion.id ? "Editar" : "Nueva"} Versión de Proyecto
                        </Typography>
                        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                            <div className="form-outline mb-4">
                                <Controller
                                    control={control}
                                    name="version"
                                    render={({ field }) => (
                                        <TextField {...field} label="Versión" variant="outlined" fullWidth />
                                    )}
                                />
                            </div>
                            <div className="form-outline mb-4">
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <TextField {...field} label="Descripción" variant="outlined" multiline fullWidth />
                                    )}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="contained" color="primary" onClick={saveProjectVersion}>
                                    <SaveIcon />&emsp;Guardar
                                </Button>
                            </div>
                        </Typography>
                    </form>
                </Box>
            </Modal>
            <Root
                header={
                    <div className="p-24 d-flex align-items-center justify-content-between">
                        <Typography variant="h3">Versiones del Proyecto</Typography>
                        <div>
                            <Button variant="contained" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                <ArrowBackIcon />&emsp;Regresar
                            </Button>
                            <Button variant="contained" color="primary" onClick={toggleModal}>
                                <AddIcon />&emsp;Nuevo
                            </Button>
                        </div>
                    </div>
                }
                content={
                    <div className="p-24 w-100">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Versión</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projectVersions.map((version, index) => (
                                        <TableRow>
                                            <TableCell>{version.version}</TableCell>
                                            <TableCell>{version.description}</TableCell>
                                            <TableCell>{version.date}</TableCell>
                                            <TableCell>
                                                {
                                                    {
                                                        1: <MDBBadge pill color='primary'>Anterior</MDBBadge>,
                                                        2: <MDBBadge pill color='success'>Último</MDBBadge>
                                                    }[version.status]
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color="warning" onClick={() => onRollbackProjectVersion(version.id)}>
                                                    <RefreshIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => onConfirmDeleteProjectVersion(version.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
            />
        </>
    );
}

export default ProjectVersions