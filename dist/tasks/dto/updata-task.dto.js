var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
export class UpdateTaskDto {
    title;
    description;
}
__decorate([
    IsString(),
    IsOptional(),
    IsNotEmpty(),
    MinLength(3),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    IsOptional(),
    MinLength(3),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "description", void 0);
//# sourceMappingURL=updata-task.dto.js.map