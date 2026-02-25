import type { SetAction } from "@shared/types/server/SetAction";
import type { GetAction } from "@shared/types/server/GetAction";

export type Action = SetAction | GetAction;