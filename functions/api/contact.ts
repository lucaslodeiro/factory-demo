import { handleContact, type Env } from '../../src/lib/contact';
export const onRequest = ({request,env}:{request:Request;env:Env})=>handleContact(request,env);
