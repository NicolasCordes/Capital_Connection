// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUser().subscribe((data: User[]) => {
      this.users = data;
    });
  }
  editUser(userId: number | undefined): void {
    if (userId !== undefined) {
      this.router.navigate(['/edit-user', userId]);
    } else {
      console.error("User ID is undefined");
    }
  }

  deleteUser(userId: number | undefined): void {
    if (userId !== undefined && confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers(); // Recargar la lista después de eliminar
      });
    } else if (userId === undefined) {
      console.error("User ID is undefined");
    }
  }
}
