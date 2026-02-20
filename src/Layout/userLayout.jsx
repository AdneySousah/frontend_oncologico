// src/layouts/UserLayout/index.js (ou onde quer que seu layout esteja)

import { Outlet } from "react-router-dom";
import { Container, ContainerOutlet } from "./styles";
import Sidebar from "../components/SideBar";

export function UserLayout(){
    return(
        <Container>
            <Sidebar/>
            <ContainerOutlet>
                 <Outlet />
            </ContainerOutlet>
        </Container>
    )
}