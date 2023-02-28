import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@material-ui/core';


class HomePage extends React.Component {
    render()
    {
        return (
            <div>
                <h1>Home Page</h1>
                <Button onClick = {(e)=>{window.location.href="/index"}}>Logout</Button>
            </div>
        )
    }
}
export default HomePage;