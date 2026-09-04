var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
let TaskAttachment = class TaskAttachment {
    id;
    fileName;
    originalName;
    mimeType;
    size;
    taskId;
    createdAt;
    task;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TaskAttachment.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TaskAttachment.prototype, "fileName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TaskAttachment.prototype, "originalName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TaskAttachment.prototype, "mimeType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], TaskAttachment.prototype, "size", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], TaskAttachment.prototype, "taskId", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], TaskAttachment.prototype, "createdAt", void 0);
__decorate([
    ManyToOne('Task', 'attachments', {
        onDelete: 'CASCADE',
    }),
    JoinColumn({
        name: 'taskId',
    }),
    __metadata("design:type", Function)
], TaskAttachment.prototype, "task", void 0);
TaskAttachment = __decorate([
    Entity('task_attachments')
], TaskAttachment);
export { TaskAttachment };
//# sourceMappingURL=task-attachment.entity.js.map