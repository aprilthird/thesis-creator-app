import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import Select from 'react-select';
import Async, { useAsync } from 'react-select/async';
import { Controller, useForm } from 'react-hook-form';
import { createProject, getProject, updateProject } from 'src/app/services/ProjectService'
import { getStudyCenters } from 'src/app/services/StudyCenterService';
import { getCareers } from 'src/app/services/CareerService';
import { Button, Card, CardActionArea, FormLabel, TextField, Typography } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import Root from '../../Root';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

const initialState = {
    name: "",
    career_id: "",
    study_center_id: "",
    user_id: "",
    description: "",
    objectives: 0,
};

const ProjectForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [careers, setCareers] = useState([]);
    const [studyCenters, setStudyCenters] = useState([]);
    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const project = watch();

    const getAllCareers = async () => {
        const querySnapshot = await getCareers();
        const docs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docs.push({ label: data.name, value: doc.id });
        })
        setCareers(docs);
    };

    const getAllStudyCenters = async () => {
        const querySnapshot = await getStudyCenters();
        const docs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docs.push({ label: data.name, value: doc.id });
        })
        setStudyCenters(docs);
    };

    const saveProject = async (data, e) => {
        if (!params.id) {
            await createProject(project);
            dispatch(
                showMessage({
                    message: 'Proyecto Creado',
                    variant: 'success'
                })
            );
        } else {
            await updateProject(params.id, project);
            dispatch(
                showMessage({
                    message: 'Cambios guardados',
                    variant: 'success'
                })
            );
        }

        reset(initialState);
        navigate("/");
    };

    const getProjectById = async (id) => {
        try {
            const doc = await getProject(id);
            reset({ ...doc.data() });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllCareers();
        getAllStudyCenters();
        if (params.id) {
            getProjectById(params.id);
        }
    }, [params.id]);

    return (
        <Root
            header={
                <div className="p-24">
                    <Typography variant="h3">{!params.id ? "Nuevo" : "Editar"} Proyecto</Typography>
                </div>
            }
            content={
                <div className="p-24 w-100">
                    <form onSubmit={handleSubmit(saveProject)}>
                        <div class="card">
                            <div class="card-body">
                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <TextField {...field} label="Nombre" variant="outlined" fullWidth />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="objectives"
                                        render={({ field }) => (
                                            <TextField {...field} label="N° Objetivos" variant="outlined" type="number" fullWidth />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <TextField {...field} label="Descripción" variant="outlined" multiline rows={3} fullWidth />                                            
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <FormLabel>Centro de Estudios</FormLabel>
                                    <Controller
                                        control={control}
                                        name="study_center_id"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <Select className="font-medium text-14" options={studyCenters} ref={ref} onChange={val => onChange(val.value)} value={studyCenters.find(c => c.value === value)} />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <FormLabel>Carrera</FormLabel>
                                    <Controller
                                        control={control}
                                        name="career_id"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <Select className="font-medium text-14" options={careers} ref={ref} onChange={val => onChange(val.value)} value={careers.find(c => c.value === value)} />
                                        )}
                                    />
                                </div>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <Button variant="contained" onClick={() => navigate("/")}>
                                    <ArrowBackIcon />&emsp;Regresar
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disabled={!project.name || !project.career_id || !project.study_center_id}>
                                    <SaveIcon />&emsp;Guardar
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        />
    )
}

export default ProjectForm