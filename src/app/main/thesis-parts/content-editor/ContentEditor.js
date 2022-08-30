import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import Select, { InputActionMeta } from 'react-select';
import Async, { useAsync } from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { useForm, useFormState, watch, Controller } from 'react-hook-form';
import { createTitle, updateTitle, getTitle, getCurrentTitle } from 'src/app/services/TitleService'
import { getVariables, getVariablesByCareerId } from 'src/app/services/VariableService';
import { getCurrentProjectVariables, getProjectVariables } from 'src/app/services/ProjectVariableService';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import Root from '../../Root';
import { Button, FormLabel, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { createContent, getCurrentContent, updateContent } from 'src/app/services/ContentService';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';

const initialState = {
    id: "",
    content: "",
    project_id: "",
    project_version_id: "",
};

const ContentEditor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [needsRefresh, setNeedsRefresh] = useState(true);
    const contentCategory = parseInt(searchParams.get("categoria"));
    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const content = watch();

    const getContentByCategoryAndId = async (projectId, contentCategory) => {
        try {
            const querySnapshot = await getCurrentContent(projectId, contentCategory);
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            if (docs.length > 0) {
                const doc = docs[0];
                reset(doc);
            }
            setNeedsRefresh(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const subscription = watch((data) => {
            console.log(data);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [watch]);

    const onSubmit = async (data, e) => {
        if (!content.id) {
            await createContent({ ...content, category: contentCategory, project_id: params.id, project_version_id: "" });
        } else {
            await updateContent(content.id, content);
        }
        dispatch(
            showMessage({
                message: 'Cambios guardados',
                variant: 'success'
            })
        );
        reset(initialState);
        navigate(`/proyectos/${params.id}/detalle`);
    };

    const onError = (errors, e) => {
        console.log(errors, e);
    };

    useEffect(() => {
        getContentByCategoryAndId(params.id, contentCategory);
    }, [reset]);

    const contentDictionary = {
        1: { name: "Área estratégica de desarrollo prioritario" },
        2: { name: "Actividad económica en la que se aplicaría la investigación" },
        3: { name: "Alcance de la solución" },
        4: { name: "Planteamiento del problema" },
        5: { name: "Justificación Teórica" },
        6: { name: "Justificación Metodológica" },
        7: { name: "Justificación Práctica" },
        8: { name: "Justificación Académica" },
        9: { name: "Justificación por Conveniencia" },
        10: { name: "Justificación Económica" },
        11: { name: "Justificación Técnica" },
        12: { name: "Justificación Tecnológica" },
        13: { name: "Justificación Doctrinaria" },
        14: { name: "Justificación Pedagógica" },
    };

    const getContentName = () => {
        return contentDictionary[contentCategory].name || "Contenido";
    };

    return (
        <Root
            header={
                <div className="p-24">
                    <Typography variant="h3">Contenido</Typography>
                    <Typography variant="h5">{getContentName()}</Typography>
                </div>
            }
            content={
                <div className="p-24 w-100">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="card">
                            <div class="card-body">
                                <div class="form-outline mb-4">
                                    <FormLabel>Contenido</FormLabel>
                                    <Controller 
                                        control={control}
                                        name="content"
                                        render={({ field }) => (
                                            <WYSIWYGEditor {...field} />
                                        )}
                                    />
                                </div>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <Button variant="contained" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                    <ArrowBackIcon />&emsp;Regresar
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
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

export default ContentEditor