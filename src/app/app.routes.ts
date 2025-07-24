import { Routes } from '@angular/router';
import { SignupComponent } from './components/pages/signup/signup.component';
import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DashboardComponent } from './components/pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './components/pages/user/user-dashboard/user-dashboard.component';
import { adminGuard } from './services/admin.guard';
import { userGuard } from './services/user.guard';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { WelcomeComponent } from './components/pages/admin/welcome/welcome.component';
import { ViewCategoriesComponent } from './components/pages/admin/view-categories/view-categories.component';
import { AddCategoriesComponent } from './components/pages/admin/add-categories/add-categories.component';
import { ViewQuizzesComponent } from './components/pages/admin/view-quizzes/view-quizzes.component';
import { AddQuizComponent } from './components/pages/admin/add-quiz/add-quiz.component';
import { UpdateQuizComponent } from './components/pages/admin/update-quiz/update-quiz.component';
import { ViewQuizQuestionsComponent } from './components/pages/admin/view-quiz-questions/view-quiz-questions.component';
import { AddQuestionComponent } from './components/pages/admin/add-question/add-question.component';
import { LoadQuizComponent } from './components/pages/user/load-quiz/load-quiz.component';
import { InstructionsComponent } from './components/pages/user/instructions/instructions.component';
import { StartComponent } from './components/pages/user/start/start.component';

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
            },
            {
                path: "quiz/:qid",
                component: UpdateQuizComponent
            },
            {
                path: "view-questions/:qid/:title",
                component: ViewQuizQuestionsComponent
            },
            {
                path: "add-question/:qid/:title",
                component: AddQuestionComponent
            }
        ]


    },
    {
        path: "user-dashboard",
        component: UserDashboardComponent,
        canActivate: [userGuard],
        children: [
            {
                path: ":catId",
                component: LoadQuizComponent
            },
            {
                path: "instructions/:qid",
                component: InstructionsComponent
            },



        ]
    },
    {
        path: "start/:qid",
        component: StartComponent,
        canActivate: [userGuard],
    }

];
