import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { adminGuard } from './services/admin.guard';
import { userGuard } from './services/user.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories.component';
import { AddCategoriesComponent } from './pages/admin/add-categories/add-categories.component';
import { ViewQuizzesComponent } from './pages/admin/view-quizzes/view-quizzes.component';
import { AddQuizComponent } from './pages/admin/add-quiz/add-quiz.component';

export const routes: Routes = [
    {
        path: "signup",
        component: SignupComponent,
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent,
        pathMatch: "full"
    },
    {
        path: "",
        component: HomeComponent

    },
    {
        path: "admin",
        component: DashboardComponent,
        canActivate: [adminGuard],// Assuming you have an admin guard defined
        children: [
            {
                path: "",
                component: WelcomeComponent
            }
            ,
            {
                path: "profile",
                component: ProfileComponent,
            },
            {
                path: "categories",
                component: ViewCategoriesComponent
            },
            {
                path: "add-category",
                component: AddCategoriesComponent
            },
            {
                path: "quizzes",
                component: ViewQuizzesComponent
            },
            {
                path: "add-quiz",
                component: AddQuizComponent
            }
        ]


    },
    {
        path: "user-dashboard",
        component: UserDashboardComponent,
        pathMatch: "full",
        canActivate: [userGuard]
    }
];
