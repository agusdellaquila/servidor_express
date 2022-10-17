import "../configs/config.js";
import { UsuariosModel } from "../models/usuarios.model.js";

export class UsuarioService {

    ID_FIELD = "_id";
    USERNAME_FIELD = 'username';

    static getInstance() {
        return new UsuarioService();
    }

    constructor() {
        if(typeof UsuarioService.instance === 'object') {
            return UsuarioService.instance;
        }
        UsuarioService.instance = this;
        return this;
    }
    
    async createUser(object) {
        try {
            return await UsuariosModel.create(object);
        } catch (error) {
            return null;
        }
    }
    
    async loginUser(object) {
        try {
            const user = await UsuariosModel.findOne({
                [this.USERNAME_FIELD] : object.username
            });
            
            if (!user) {
                return null;   
            } 
            
            return await user.comparePassword(object.password);
        
        } catch (error) {
            return null;
        }
    }
}