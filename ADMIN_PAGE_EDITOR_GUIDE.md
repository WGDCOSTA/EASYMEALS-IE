# Admin Page Editor - Guia Completo

## Visão Geral

Foi implementado um editor profissional de páginas no painel administrativo como alternativa ao editor frontend (estilo Elementor). Este sistema permite criar e editar páginas da web diretamente do admin com interface moderna e intuitiva.

## Recursos Principais

### 1. **Gerenciamento de Páginas** (`/admin/pages`)
- Listar todas as páginas do site
- Criar novas páginas
- Editar páginas existentes
- Duplicar páginas
- Excluir páginas
- Ver status (publicada/rascunho)

### 2. **Editor Visual** (`/admin/pages/editor/[id]`)

#### Interface Dividida em 3 Painéis:

**Painel Esquerdo - Blocos Disponíveis:**
- Hero Section - Seção hero com título, subtítulo e botão
- Text Block - Bloco de texto com formatação
- Image - Inserir imagens
- Button - Botões com links
- Card - Cards para conteúdo
- Grid - Layouts em grid
- Feature Section - Seções de recursos
- Call to Action - CTAs personalizados
- Spacer - Espaçamento vertical

**Painel Central - Canvas:**
- Preview em tempo real
- Visualização responsiva (Desktop/Tablet/Mobile)
- Seleção de blocos
- Indicadores de bloco selecionado

**Painel Direito - Propriedades:**
- Aba Design: Editar conteúdo e estilos do bloco
- Aba Page: Configurar título, slug e status da página

### 3. **Barra de Ferramentas Superior**
- Botão Voltar
- Visualização Responsiva
- Preview
- Save
- Indicador de mudanças não salvas

## Como Acessar

1. Faça login como ADMIN ou SUPER_ADMIN
2. No menu lateral, clique em **"Pages"**
3. Você verá a lista de todas as páginas
4. Clique em "New Page" para criar ou no ícone de edição para editar

## Estrutura Técnica

APIs Criadas:
- GET /api/admin/pages - Lista todas as páginas
- POST /api/admin/pages - Cria nova página
- GET /api/admin/pages/[id] - Obtém página específica
- PUT /api/admin/pages/[id] - Atualiza página
- DELETE /api/admin/pages/[id] - Exclui página
- POST /api/admin/pages/[id]/duplicate - Duplica página

Componentes:
- /app/admin/pages/page.tsx - Lista de páginas
- /app/admin/pages/editor/[id]/page.tsx - Wrapper do editor
- /components/admin/page-editor.tsx - Editor visual completo

Data de Implementação: 22 de Outubro de 2025
Versão: 1.0.0
