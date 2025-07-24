import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { LoginService } from '../../../services/login.service';

export interface ProfileData {
  field: string;
  value: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  displayedColumns: string[] = ['field', 'value'];
  dataSource: ProfileData[] = [];

  constructor(private login: LoginService) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    console.log('User data:', this.user);

    if (this.user) {
      this.setupTableData();
    }
  }

  private setupTableData(): void {
    this.dataSource = [
      { field: 'Username', value: this.user.username || 'N/A' },
      { field: 'User ID', value: this.user.id?.toString() || 'N/A' },
      { field: 'Email', value: this.user.email || 'N/A' },
      { field: 'Phone', value: this.user.phone || 'N/A' },
      { field: 'Role', value: this.user.authorities?.[0]?.authority || 'N/A' },
      { field: 'Status', value: this.user.enabled ? 'ACTIVE' : 'INACTIVE' }
    ];
  }

  getFullName(): string {
    if (!this.user) return 'Unknown User';
    const firstName = this.user.firstName || '';
    const lastName = this.user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  }

  getProfileImageUrl(): string {
    if (!this.user || !this.user.profile) {
      return 'assets/images/default-avatar.png';
    }

    // If it's already a full URL, use it
    if (this.user.profile.startsWith('http')) {
      return this.user.profile;
    }

    // If it's just a filename, construct the full path
    return `assets/images/profiles/${this.user.profile}`;
  }

  // Button click handlers
  onUpdate(): void {
    console.log('Update button clicked');
    console.log('Current user:', this.user);
    // Add your update logic here later
  }

  onShare(): void {
    console.log('Share button clicked');
    console.log('Sharing profile of:', this.getFullName());
    // Add your share logic here later
  }
}