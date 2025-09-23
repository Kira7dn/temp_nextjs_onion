# 📑 PRD – Frontend Clean Architecture Project

## 1. Mục tiêu

* Xây dựng **Frontend web application** theo chuẩn **Clean/Onion Architecture** (Next.js + TypeScript).
* Tách biệt rõ ràng **Business Logic (Workflow, Use Case)** và **UI (Figma → Component)**.
* Sử dụng **AI + MCP Tool + Winsurf Workflow** để tự động hóa việc sinh code từ **User Story** và **UI Design**.
* Áp dụng **Shadcn/UI** để có bộ component system sẵn, đồng bộ với Figma Design System.

---

## 2. Công nghệ & Công cụ

* **Next.js + TypeScript**: core framework.
* **MCP Tool**: quản lý JSON schema (feature → entity/use case/repository/hook/component).
* **Winsurf Workflow**: orchestrate pipeline từ user story → JSON spec → codegen.
* **Figma**: UI/UX design, xuất design tokens và component spec.
* **Shadcn/UI**: component library đồng bộ với Figma, dễ custom.
* **Jest + RTL + MSW + Playwright**: testing strategy (unit, integration, e2e).

---

## 3. Quy trình phát triển

### 3.1. Đầu vào

* **User Story** (từ PM/BA).
* **Figma UI Design** (từ Designer).

### 3.2. Workflow

1. **User Story → JSON Spec (MCP Tool)**

   * MCP Tool nhận user story.
   * Generate JSON array of objects (theo schema Clean Arch).
   * JSON định nghĩa entity, use case, repo, hook, component skeleton.

2. **JSON Spec → Codebase (Winsurf Workflow)**

   * Winsurf đọc JSON.
   * Generate code cho từng layer (domain, application, infra, presentation).
   * Sinh hook và simple component (skeleton).

3. **UI Design → Component (Figma + Shadcn)**

   * Figma export design tokens (màu, font, spacing).
   * Figma export component tree (hoặc dùng plugin Locofy/Anima).
   * Dev/AI map component với Shadcn base component.
   * Replace component skeleton bằng Shadcn/Figma-styled component.

4. **Integration**

   * Hook (logic) → gắn vào Component (UI).
   * Component → Page → Next.js routing.
   * Test integration & e2e.

---

## 4. Output

* **Codebase structure** theo `workflow_FE.md` (src/domain, src/application, src/infrastructure, src/presentation, src/shared).
* **Generated code** từ JSON spec:

  * Domain entity/service.
  * Application use case/interface.
  * Infrastructure repo.
  * Presentation hook + skeleton component.
* **Styled component** từ Shadcn + Figma mapping.
* **Automated tests** theo 3 lớp: Unit, Integration, E2E.

---

## 5. Success Criteria

* 90% user story có thể auto-generate skeleton code (hook + component).
* 100% UI component được sync với Figma + Shadcn.
* 80% test coverage cho Domain + Application.
* CI/CD pipeline chạy full test (unit + integration + e2e) trước merge.

---

## 6. Roadmap (gợi ý)

* **Sprint 1**: Setup project, kiến trúc folder, Jest + Playwright config.
* **Sprint 2**: Tích hợp MCP Tool + Winsurf Workflow (User Story → JSON → Code).
* **Sprint 3**: Kết nối Figma API, export tokens, đồng bộ với Shadcn.
* **Sprint 4**: Build sample feature E2E (Cart).
* **Sprint 5+**: Rollout các feature thực tế.

---

✅ Với PRD này, dự án có thể bắt đầu xây dựng frontend theo hướng **semi-automated workflow**: từ user story + Figma design → JSON → code skeleton → UI hoàn chỉnh.
