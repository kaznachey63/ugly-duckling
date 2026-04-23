type RoleNameEn = "admin" | "customer" | "unknown";
type RoleNameRu = "Администратор" | "Заказчик" | "Неизвестный";

export interface Role {
    id: number,
    nameRu: RoleNameRu,
    nameEn: RoleNameEn
}