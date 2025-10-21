import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './home/sections/catalogo/catalogo.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MiPerfilComponent } from './pages/miperfil/miperfil.component';
import { ChatAiComponent } from './components/chat-ai/chat-ai.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'perfil', component: MiPerfilComponent},
  { path: 'chat', component: ChatAiComponent },
  { path: '**', redirectTo: 'login' }
];
