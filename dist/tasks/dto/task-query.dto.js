var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBooleanString, IsIn, IsInt, IsOptional, IsString, Max, Min, } from 'class-validator';
import { Type } from 'class-transformer';
export class TaskQueryDto {
    search;
    completed;
    sortBy;
    order;
    page;
    limit;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    IsBooleanString(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "completed", void 0);
__decorate([
    IsOptional(),
    IsIn([
        'id',
        'title',
        'createdAt',
        'updatedAt',
    ]),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsIn([
        'ASC',
        'DESC',
        'asc',
        'desc',
    ]),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "order", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], TaskQueryDto.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], TaskQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=task-query.dto.js.map