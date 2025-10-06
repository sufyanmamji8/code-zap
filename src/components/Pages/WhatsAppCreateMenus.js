import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MENU_ENDPOINTS } from 'Api/Constant';
import { 
  Plus, Edit2, Trash2, Menu as MenuIcon, 
  FileText, AlertTriangle, 
  X, Calendar,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  LayoutGrid,
  List,
  Zap,
  MessageCircle,
  Settings,
  Users
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Enhanced Custom CSS with smooth animations and better design
const styles = `
:root {
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
  
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --purple: #8b5cf6;
  
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  --backdrop-blur: blur(8px);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: white;
  min-height: 100vh;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Layout */
.whatsapp-modern-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-50) 100%);
  position: relative;
  padding-top: 100px;
}

.whatsapp-modern-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.modern-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* Enhanced Sidebar with Glass Morphism */
.modern-sidebar {
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--backdrop-blur);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-xl);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.modern-sidebar.collapsed {
  width: 0;
  min-width: 0;
  overflow: hidden;
}

.mobile-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: var(--backdrop-blur);
  z-index: 99;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sidebar-header {
  padding: var(--space-8) var(--space-6) var(--space-6);
  border-bottom: 1px solid var(--gray-200);
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  position: relative;
  overflow: hidden;
}

.sidebar-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 100%);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--space-2) 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sidebar-title::before {
  content: '💬';
  font-size: 1.75rem;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 400;
}

.sidebar-search {
  padding: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
  background: white;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) 3rem;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  background: var(--gray-50);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
  background: white;
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
}

.menu-list-container {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
  background: white;
}

/* Custom scrollbar for menu list */
.menu-list-container::-webkit-scrollbar {
  width: 6px;
}

.menu-list-container::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
}

.menu-list-container::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 10px;
}

.menu-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--gray-400);
}

.menu-item-modern {
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--gray-200);
  margin-bottom: var(--space-3);
  cursor: pointer;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.6s ease;
}

.menu-item-modern:hover::before {
  left: 100%;
}

.menu-item-modern:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.menu-item-modern.active {
  border-color: var(--primary-500);
  background: linear-gradient(135deg, var(--primary-50), var(--primary-25));
  box-shadow: var(--shadow-md);
}

.menu-item-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.menu-item-icon {
  color: var(--primary-500);
  background: var(--primary-50);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-title {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.95rem;
  flex: 1;
}

.menu-item-id {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-left: calc(44px + var(--space-3));
  font-family: 'Monaco', 'Consolas', monospace;
}

/* Enhanced Main Content */
.modern-main-content {
  flex: 1;
  background: transparent;
  position: relative;
  min-height: 100vh;
}

.content-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: var(--space-8) var(--space-8) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
  gap: var(--space-6);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  flex: 1;
}

.sidebar-toggle {
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-3);
  cursor: pointer;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.sidebar-toggle:hover {
  border-color: var(--primary-300);
  color: var(--primary-600);
  transform: scale(1.05);
}

.header-title-section h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--gray-900);
  margin: 0 0 var(--space-2) 0;
  background: linear-gradient(135deg, var(--gray-900), var(--primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title-section p {
  color: var(--gray-600);
  margin: 0;
  font-size: 1.125rem;
  font-weight: 400;
}

.create-menu-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.create-menu-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.create-menu-btn:hover::before {
  left: 100%;
}

.create-menu-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

/* Enhanced Menu Grid */
.menu-grid {
  padding: var(--space-8);
  display: grid;
  gap: var(--space-8);
  max-width: 1200px;
  margin: 0 auto;
}

.menu-card-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--backdrop-blur);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  position: relative;
}

.menu-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-500), var(--purple));
}

.menu-card-modern:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-xl);
}

.card-header-modern {
  padding: var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.card-title-section {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  flex: 1;
}

.expand-toggle {
  background: var(--primary-50);
  border: 1.5px solid var(--primary-200);
  color: var(--primary-600);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.expand-toggle:hover {
  background: var(--primary-100);
  transform: scale(1.1);
}

.expand-toggle.rotated {
  transform: rotate(90deg);
}

.expand-toggle.rotated:hover {
  transform: rotate(90deg) scale(1.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
  line-height: 1.3;
}

.menu-type-badge-modern {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-xl);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.menu-type-options {
  background: linear-gradient(135deg, var(--success), #059669);
  color: white;
}

.menu-type-prompt {
  background: linear-gradient(135deg, var(--warning), #d97706);
  color: white;
}

.card-body-modern {
  padding: 0 var(--space-8) var(--space-8);
}

.menu-id-section-modern {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  margin-bottom: var(--space-6);
  color: var(--gray-500);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--gray-200);
}

/* Enhanced Options List */
.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.option-item-modern {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--gray-50), white);
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--gray-200);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option-item-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-500), var(--purple));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.option-item-modern:hover::before {
  opacity: 1;
}

.option-item-modern:hover {
  background: linear-gradient(135deg, var(--primary-50), white);
  border-color: var(--primary-300);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.option-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.option-content {
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
  font-size: 1rem;
}

.option-flow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  color: var(--gray-500);
}

.add-submenu-btn {
  background: var(--primary-100);
  border: 1.5px solid var(--primary-200);
  color: var(--primary-600);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-submenu-btn:hover {
  background: var(--primary-200);
  transform: scale(1.1);
}

/* Enhanced Modal with Scroll */
.modern-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: var(--backdrop-blur);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
  animation: fadeIn 0.2s ease-out;
}

.modern-modal {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: var(--backdrop-blur);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-modern {
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.modal-header-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 100%);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  position: relative;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--space-3);
  border-radius: var(--radius-xl);
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Modal Body with Scroll */
.modal-body-modern {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Custom scrollbar for modal */
.modal-body-modern::-webkit-scrollbar {
  width: 8px;
}

.modal-body-modern::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
  margin: var(--space-2);
}

.modal-body-modern::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 10px;
}

.modal-body-modern::-webkit-scrollbar-thumb:hover {
  background: var(--gray-400);
}

/* Enhanced Form Sections */
.form-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: var(--backdrop-blur);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-200);
}

.form-section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.form-section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  border-radius: var(--radius-sm);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.form-group-modern {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.form-label::after {
  content: '*';
  color: var(--error);
  opacity: 0.7;
}

.form-input, .form-select, .form-textarea {
  padding: var(--space-4);
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: var(--space-1);
}

/* Enhanced Options Container */
.options-container-modern {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--space-2);
}

.options-container-modern::-webkit-scrollbar {
  width: 6px;
}

.options-container-modern::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
}

.options-container-modern::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 10px;
}

.option-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr 60px;
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--gray-200);
  transition: all 0.2s ease;
  position: relative;
}

.option-row:hover {
  border-color: var(--primary-300);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.option-number-display {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.remove-option-btn {
  background: none;
  border: 1.5px solid var(--gray-300);
  color: var(--gray-500);
  cursor: pointer;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-1);
}

.remove-option-btn:hover {
  background: var(--error);
  border-color: var(--error);
  color: white;
  transform: scale(1.1);
}

.add-option-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-start;
  box-shadow: var(--shadow-md);
  margin-top: var(--space-4);
}

.add-option-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modal-footer-modern {
  padding: var(--space-6);
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  background: white;
  flex-shrink: 0;
}

.cancel-btn {
  padding: var(--space-4) var(--space-8);
  border: 1.5px solid var(--gray-300);
  border-radius: var(--radius-lg);
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
}

.submit-btn {
  padding: var(--space-4) var(--space-8);
  border: none;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-500), var(--purple));
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Enhanced Card Actions */
.card-actions {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-6);
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.action-btn {
  padding: var(--space-3) var(--space-6);
  border: 1.5px solid var(--gray-300);
  border-radius: var(--radius-lg);
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.edit-btn:hover {
  border-color: var(--primary-300);
  color: var(--primary-600);
  background: var(--primary-50);
}

.delete-btn:hover {
  border-color: var(--error);
  color: var(--error);
  background: var(--error-50);
}

/* Enhanced Prompt Content */
.prompt-content-modern {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--gray-200);
}

.prompt-text {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  color: var(--gray-700);
  line-height: 1.6;
}

.validation-type, .next-menu-flow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
  font-size: 0.875rem;
}

.next-menu-flow {
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-menu-flow:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    width: 85%;
    max-width: 300px;
  }
  
  .modern-sidebar.open {
    transform: translateX(0);
  }
  
  .header-top {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .header-left {
    width: 100%;
  }
  
  .header-title-section h1 {
    font-size: 1.75rem;
  }
  
  .create-menu-btn {
    width: 100%;
    justify-content: center;
  }
  
  .menu-grid {
    padding: var(--space-4);
    gap: var(--space-6);
  }
  
  .card-header-modern {
    flex-direction: column;
    gap: var(--space-4);
    align-items: stretch;
  }
  
  .option-row {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modern-modal {
    margin: var(--space-4);
    max-height: calc(100vh - var(--space-8));
  }
  
  .modal-body-modern {
    padding: var(--space-4);
  }
  
  .option-row {
    grid-template-columns: 50px 1fr 40px;
    grid-template-areas: 
      "number title remove"
      "content content content";
  }
  
  .option-number-display {
    grid-area: number;
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }
  
  .option-row > :nth-child(2) { grid-area: title; }
  .option-row > :nth-child(3) { grid-area: content; }
  .option-row > :nth-child(4) { grid-area: content; }
  .option-row > :nth-child(5) { grid-area: content; }
  .option-row > :last-child { grid-area: remove; }
}

@media (max-width: 480px) {
  .content-header {
    padding: var(--space-6) var(--space-4);
  }
  
  .menu-grid {
    padding: var(--space-4);
  }
  
  .card-header-modern,
  .card-body-modern {
    padding: var(--space-6);
  }
  
  .modal-header-modern,
  .modal-body-modern {
    padding: var(--space-6);
  }
  
  .modal-footer-modern {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}

/* Empty State Enhancement */
.empty-state {
  text-align: center;
  padding: var(--space-12);
  color: var(--gray-500);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: var(--backdrop-blur);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-state svg {
  margin-bottom: var(--space-6);
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--gray-400);
  margin-bottom: var(--space-3);
  font-size: 1.5rem;
}

.empty-state p {
  font-size: 1.125rem;
}

/* Loading Overlay Enhancement */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--backdrop-blur);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  flex-direction: column;
  gap: var(--space-6);
}

.loading-text {
  font-size: 1.125rem;
  color: var(--gray-600);
  font-weight: 500;
}

/* Error State Enhancement */
.error-state {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(135deg, var(--error), #dc2626);
  color: white;
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-md);
}

/* Utility Classes */
.text-muted {
  color: var(--gray-500);
}

.cursor-pointer {
  cursor: pointer;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }

.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }

.p-0 { padding: 0; }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }

/* Validation Rules Styles */
.validation-rules {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.validation-rule-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
}

.rule-example {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-family: 'Monaco', 'Consolas', monospace;
}

.rule-description {
  font-size: 0.875rem;
  color: var(--gray-600);
}
`;

// Custom Components
const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  const baseClass = 'action-btn';
  const variantClass = variant === 'danger' ? 'delete-btn' : variant === 'secondary' ? 'cancel-btn' : 'edit-btn';
  return (
    <button 
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => {
  return (
    <div className={`menu-card-modern ${className}`}>
      {children}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay" onClick={onClose}>
      <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-modern">
          <h3 className="modal-title">{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Enhanced Main Component
const WhatsAppCreateMenus = () => {
  const [menus, setMenus] = useState([]);
  const [isFirstMenu, setIsFirstMenu] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuPath, setMenuPath] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  const validationFormats = {
    date: [
      { 
        label: 'Month-Year', 
        value: '^[A-Za-z]{3}-\\d{4}$', 
        example: 'Jan-2024',
        errorMessage: 'Please enter date in Month-YYYY format (e.g., Jan-2024)'
      },
      { 
        label: 'Day-Month-Year', 
        value: '^\\d{1,2}-[A-Za-z]{3}-\\d{4}$',
        example: '22-Nov-2024',
        errorMessage: 'Please enter date in DD-Month-YYYY format (e.g., 22-Nov-2024)'
      },
      { 
        label: 'DD/MM/YYYY', 
        value: '^\\d{1,2}/\\d{1,2}/\\d{4}$',
        example: '22/11/2024',
        errorMessage: 'Please enter date in DD/MM/YYYY format (e.g., 22/11/2024)'
      }
    ],
    number: [
      { min: 0, max: 1000, description: 'Amount (0-1000)' },
      { min: 1000, max: 10000, description: 'Amount (1000-10000)' },
      { min: 10000, max: 100000, description: 'Amount (10000-100000)' }
    ],
    phone: [
      { label: 'International', value: '^\\+?\\d{10,14}$', example: '+1234567890' },
      { label: 'Local', value: '^\\d{10}$', example: '1234567890' }
    ],
    email: [
      { label: 'Standard', value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', example: 'user@domain.com' }
    ],
    text: [
      { label: 'Alphanumeric', value: '^[a-zA-Z0-9\\s]+$', example: 'Letters and numbers only' },
      { label: 'Letters only', value: '^[a-zA-Z\\s]+$', example: 'Letters only' }
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const createInitialMenuState = () => ({
    menuId: '', 
    menuTitle: '',
    menuType: 'options',
    prompt: '',
    nextMenuId: '',
    apiCall: '',
    validationType: 'none',
    validationRules: {
      min: null,
      max: null,
      format: '',
      required: true
    },
    menuOptions: [],
    isMainMenu: false
  });

  const [formData, setFormData] = useState(createInitialMenuState());

  // Add CSS to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(MENU_ENDPOINTS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      const allMenus = response.data.data || [];
      setMenus(allMenus);
      
      const mainMenuExists = allMenus.some(menu => menu.isMainMenu === true);
      setIsFirstMenu(!mainMenuExists);

      if (allMenus.length > 0 && !selectedMenuId) {
        const firstMainMenu = allMenus.find(menu => menu.isMainMenu) || allMenus[0];
        setSelectedMenuId(firstMainMenu.menuId);
        setActiveMenu(firstMainMenu);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      setError(error.response?.data?.message || 'Failed to fetch menus');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleInputChange = (e, field, isOption = false, optionIndex = null, isBoolean = false) => {
    const value = isBoolean ? e.target.value === 'true' : e.target.value;
    
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (isOption) {
        newData.menuOptions[optionIndex][field] = value;
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newData[parent] = { ...newData[parent], [child]: value };
      } else {
        newData[field] = value;
      }
      
      return newData;
    });
  };

  const addOption = () => {
    setFormData(prevData => ({
      ...prevData,
      menuOptions: [
        ...prevData.menuOptions, 
        { 
          id: (prevData.menuOptions.length + 1).toString(), 
          title: '', 
          nextMenuId: '', 
          apiCall: '',
          apiText: ''
        }
      ]
    }));
  };

  const removeOption = (index) => {
    setFormData(prevData => {
      const newOptions = prevData.menuOptions.filter((_, i) => i !== index);
      return {
        ...prevData,
        menuOptions: newOptions.map((option, idx) => ({
          ...option,
          id: (idx + 1).toString()
        }))
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      const endpoint = currentMenu 
        ? MENU_ENDPOINTS.UPDATE(currentMenu.menuId)
        : MENU_ENDPOINTS.CREATE;
      
      const method = currentMenu ? 'put' : 'post';
      
      if (!formData.menuId && formData.menuTitle) {
        formData.menuId = formData.menuTitle.toLowerCase().replace(/\s+/g, '-');
      }
      
      const payload = method === 'post' 
        ? { menus: [formData] }
        : formData;
      
      const response = await axios[method](endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (method === 'post') {
        setMenus(prevMenus => [...prevMenus, response.data.data[0]]);
      } else {
        setMenus(prevMenus => 
          prevMenus.map(menu => 
            menu.menuId === currentMenu.menuId 
              ? response.data.data 
              : menu
          )
        );
      }

      setFormData(createInitialMenuState());
      setModalOpen(false);
      setCurrentMenu(null);
      
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
      setError(error.response?.data?.message || 'Failed to save menu');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate('/login');
        return;
      }

      await axios.delete(MENU_ENDPOINTS.DELETE(menuId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      setMenus(prevMenus => prevMenus.filter(menu => menu.menuId !== menuId));
      if (selectedMenuId === menuId) {
        setSelectedMenuId(null);
        setActiveMenu(null);
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      setError(error.response?.data?.message || 'Failed to delete menu');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setFormData(createInitialMenuState());
      setCurrentMenu(null);
    }
  };

  const editMenu = (menu) => {
    setCurrentMenu(menu);
    setFormData(menu);
    setModalOpen(true);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenuId(menu.menuId);
    setMenuPath([menu.menuId]);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleMenuSelect = (menuId) => {
    const menu = menus.find(m => m.menuId === menuId);
    if (menu) {
      setSelectedMenuId(menuId);
      if (!menuPath.includes(menuId)) {
        setMenuPath([...menuPath, menuId]);
      } else {
        const index = menuPath.indexOf(menuId);
        setMenuPath(menuPath.slice(0, index + 1));
      }
    }
  };

  const toggleExpandMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const getChildMenus = (menuId) => {
    const menu = menus.find(m => m.menuId === menuId);
    if (!menu) return [];
    
    return menus.filter(m => 
      (menu.menuType === 'options' && 
       menu.menuOptions?.some(opt => opt.nextMenuId === m.menuId)) ||
      (menu.menuType === 'prompt' && menu.nextMenuId === m.menuId)
    );
  };

  const createSubMenu = (parentMenu) => {
    const parentMenuId = parentMenu.menuId;
    const parentMenuTitle = parentMenu.menuTitle;
    
    setFormData({
      ...createInitialMenuState(),
      menuId: parentMenuId,
      menuTitle: parentMenuTitle
    });
    
    setModalOpen(true);
  };

  const filteredMenus = menus.filter(menu => 
    menu.menuTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.menuId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mainMenus = filteredMenus.filter(menu => menu.isMainMenu === true);

  const renderSidebarMenus = () => {
    if (mainMenus.length === 0) {
      return (
        <div className="empty-state" style={{padding: 'var(--space-8)'}}>
          <MessageCircle size={48} />
          <h3>No menus found</h3>
          <p className="text-muted">Create your first menu to get started</p>
        </div>
      );
    }

    return mainMenus.map((menu) => (
      <div
        key={menu.menuId}
        className={`menu-item-modern ${activeMenu?.menuId === menu.menuId ? 'active' : ''}`}
        onClick={() => handleMenuClick(menu)}
      >
        <div className="menu-item-header">
          <div className="menu-item-icon">
            <MenuIcon size={16} />
          </div>
          <span className="menu-item-title">{menu.menuTitle}</span>
        </div>
        <div className="menu-item-id">{menu.menuId}</div>
      </div>
    ));
  };

  return (
    <div className="whatsapp-modern-container">
      <style>{styles}</style>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <DotLottieReact
            src="https://lottie.host/5060de43-85ac-474a-a85b-892f9730e17a/b3jJ1vGkWh.lottie"
            loop
            autoplay
            style={{ width: "150px", height: "150px" }}
          />
          <div className="loading-text">Loading menus...</div>
        </div>
      )}

      <div className="modern-layout">
        {/* Mobile Overlay */}
        {isMobile && !sidebarCollapsed && (
          <div className="mobile-sidebar-overlay" onClick={toggleSidebar} />
        )}

        {/* Enhanced Sidebar with Scroll */}
        <div className={`modern-sidebar ${sidebarCollapsed ? 'collapsed' : isMobile ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">WhatsApp Menus</h3>
            <div className="sidebar-subtitle">Manage your conversation flows</div>
          </div>

          <div className="sidebar-search">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="menu-list-container">
            {renderSidebarMenus()}
          </div>
        </div>

        {/* Main Content */}
        <div className="modern-main-content">
          <div className="content-header">
            <div className="header-top">
              <div className="header-left">
                {isMobile && (
                  <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <MenuIcon size={20} />
                  </button>
                )}
                <div className="header-title-section">
                  <h1>Menu Builder</h1>
                  <p>Design and manage your WhatsApp conversation flows</p>
                </div>
              </div>
              
              <button className="create-menu-btn" onClick={toggleModal}>
                <Plus size={20} />
                Create New Menu
              </button>
            </div>

            {error && (
              <div className="error-state">
                <AlertTriangle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Menu Content */}
          <div className="menu-grid">
            {selectedMenuId ? (
              menus.filter(m => m.menuId === selectedMenuId)
                .map(menu => {
                  const childMenus = getChildMenus(menu.menuId);
                  const isExpanded = expandedMenus[menu.menuId];

                  return (
                    <Card key={menu.menuId}>
                      <div className="card-header-modern">
                        <div className="card-title-section">
                          {childMenus.length > 0 && (
                            <button
                              className={`expand-toggle ${isExpanded ? 'rotated' : ''}`}
                              onClick={() => toggleExpandMenu(menu.menuId)}
                            >
                              <ChevronRight size={20} />
                            </button>
                          )}
                          <h3 className="card-title">{menu.menuTitle}</h3>
                        </div>
                        <span className={`menu-type-badge-modern ${
                          menu.menuType === 'options' ? 'menu-type-options' : 'menu-type-prompt'
                        }`}>
                          {menu.menuType === 'options' ? 'Multiple Choice' : 'User Input'}
                        </span>
                      </div>

                      <div className="card-body-modern">
                        <div className="menu-id-section-modern">
                          <MenuIcon size={16} />
                          <span>{menu.menuId}</span>
                          {menu.isMainMenu && (
                            <span style={{
                              background: 'linear-gradient(135deg, var(--primary-500), var(--purple))', 
                              color: 'white', 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Main Menu
                            </span>
                          )}
                        </div>

                        {menu.menuType === 'options' && menu.menuOptions && menu.menuOptions.length > 0 && (
                          <div className="options-list">
                            {menu.menuOptions.map((option, idx) => (
                              <div 
                                key={idx} 
                                className="option-item-modern cursor-pointer"
                                onClick={() => option.nextMenuId && handleMenuSelect(option.nextMenuId)}
                              >
                                <div className="option-number">{option.id}</div>
                                <div className="option-content">
                                  <div className="option-title">{option.title}</div>
                                  {option.nextMenuId && (
                                    <div className="option-flow">
                                      <ArrowRight size={14} />
                                      <span>Goes to: {option.nextMenuId}</span>
                                      <button 
                                        className="add-submenu-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const parentMenu = menus.find(m => m.menuId === option.nextMenuId);
                                          if (parentMenu) {
                                            createSubMenu(parentMenu);
                                          } else {
                                            createSubMenu({
                                              menuId: option.nextMenuId,
                                              menuTitle: option.title
                                            });
                                          }
                                        }}
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {menu.menuType === 'prompt' && (
                          <div className="prompt-content-modern">
                            <div className="prompt-text">
                              <FileText size={16} />
                              {menu.prompt}
                            </div>
                            {menu.validationType && menu.validationType !== 'none' && (
                              <div className="validation-type">
                                <AlertTriangle size={16} />
                                Validates: {menu.validationType}
                              </div>
                            )}
                            {menu.nextMenuId && (
                              <div 
                                className="next-menu-flow cursor-pointer"
                                onClick={() => handleMenuSelect(menu.nextMenuId)}
                              >
                                <ChevronRight size={16} />
                                Next: {menu.nextMenuId}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Child Menus */}
                        {isExpanded && childMenus.length > 0 && (
                          <div className="mt-6">
                            <h4 style={{marginBottom: 'var(--space-4)', color: 'var(--gray-700)'}}>Connected Menus</h4>
                            <div style={{paddingLeft: 'var(--space-6)', borderLeft: '2px solid var(--primary-200)'}}>
                              {childMenus.map(childMenu => (
                                <div 
                                  key={childMenu.menuId}
                                  className="cursor-pointer mb-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-all"
                                  onClick={() => handleMenuSelect(childMenu.menuId)}
                                >
                                  <span className={`menu-type-badge-modern ${
                                    childMenu.menuType === 'options' ? 'menu-type-options' : 'menu-type-prompt'
                                  }`} style={{fontSize: '10px', padding: '4px 8px'}}>
                                    {childMenu.menuType === 'options' ? 'Multiple Choice' : 'User Input'}
                                  </span>
                                  <h5 className="mt-2 mb-1" style={{fontSize: '1rem', fontWeight: '600'}}>{childMenu.menuTitle}</h5>
                                  <small className="text-muted">{childMenu.menuId}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="card-actions">
                        <Button onClick={() => editMenu(menu)}>
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(menu.menuId)}>
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  );
                })
            ) : (
              <div className="empty-state">
                <MessageCircle size={64} />
                <h3>No Menu Selected</h3>
                <p className="text-muted">Choose a menu from the sidebar to view its details and structure</p>
                <button className="create-menu-btn" onClick={toggleModal} style={{marginTop: 'var(--space-6)'}}>
                  <Plus size={20} />
                  Create Your First Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal with Scroll */}
      <Modal 
        isOpen={modalOpen} 
        onClose={toggleModal}
        title={currentMenu ? 'Edit Menu' : 'Create New Menu'}
      >
        <form onSubmit={handleSubmit} className="modal-body-modern">
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>
            <div className="form-grid">
              <div className="form-group-modern">
                <label className="form-label">Menu ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.menuId}
                  onChange={(e) => handleInputChange(e, 'menuId')}
                  required
                  placeholder="unique-menu-id"
                />
                <div className="form-hint">
                  Unique identifier (lowercase, hyphens, no spaces)
                </div>
              </div>

              <div className="form-group-modern">
                <label className="form-label">Menu Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.menuTitle}
                  onChange={(e) => handleInputChange(e, 'menuTitle')}
                  required
                  placeholder="Enter menu title"
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label">Is Main Menu</label>
                <select
                  className="form-select"
                  value={formData.isMainMenu}
                  onChange={(e) => handleInputChange(e, 'isMainMenu', false, null, true)}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
                <div className="form-hint">
                  Main menus appear in the sidebar
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group-modern">
                <label className="form-label">Menu Type</label>
                <select
                  className="form-select"
                  value={formData.menuType}
                  onChange={(e) => handleInputChange(e, 'menuType')}
                >
                  <option value="options">Options Menu</option>
                  <option value="prompt">Prompt Menu</option>
                </select>
              </div>
              
              {formData.menuType === 'prompt' && (
                <div className="form-group-modern">
                  <label className="form-label">Validation Type</label>
                  <select
                    className="form-select"
                    value={formData.validationType}
                    onChange={(e) => handleInputChange(e, 'validationType')}
                  >
                    <option value="none">No Validation</option>
                    <option value="number">Number Only</option>
                    <option value="date">Date Format</option>
                    <option value="phone">Phone Number</option>
                    <option value="email">Email Address</option>
                    <option value="text">Text Input</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {formData.menuType === 'prompt' && (
            <div className="form-section">
              <h4 className="form-section-title">Prompt Configuration</h4>
              <div className="form-group-modern">
                <label className="form-label">Prompt Text</label>
                <textarea
                  className="form-textarea"
                  value={formData.prompt || ''}
                  onChange={(e) => handleInputChange(e, 'prompt')}
                  placeholder="What should users see when prompted?"
                  rows="3"
                />
                <div className="form-hint">
                  This message will be shown to users when they reach this menu
                </div>
              </div>

              <div className="form-group-modern">
                <label className="form-label">Next Menu ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nextMenuId || ''}
                  onChange={(e) => handleInputChange(e, 'nextMenuId')}
                  placeholder="next-menu-id"
                />
                <div className="form-hint">
                  The menu to proceed to after user input
                </div>
              </div>
            </div>
          )}

          {formData.menuType === 'options' && (
            <div className="form-section">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="form-section-title">Menu Options</h4>
                <button type="button" className="add-option-btn" onClick={addOption}>
                  <Plus size={16} />
                  Add Option
                </button>
              </div>

              <div className="options-container-modern">
                {formData.menuOptions.map((option, index) => (
                  <div key={index} className="option-row">
                    <div className="option-number-display">
                      {option.id}
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Option title"
                      value={option.title}
                      onChange={(e) => handleInputChange(e, 'title', true, index)}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Next menu ID"
                      value={option.nextMenuId}
                      onChange={(e) => handleInputChange(e, 'nextMenuId', true, index)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="API call"
                      value={option.apiCall}
                      onChange={(e) => handleInputChange(e, 'apiCall', true, index)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="API text"
                      value={option.apiText}
                      onChange={(e) => handleInputChange(e, 'apiText', true, index)}
                    />
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => removeOption(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {formData.menuOptions.length === 0 && (
                <div className="empty-state" style={{padding: 'var(--space-8)'}}>
                  <MessageCircle size={32} />
                  <h4>No options added</h4>
                  <p className="text-muted">Click "Add Option" to create menu choices</p>
                </div>
              )}
            </div>
          )}

          <div className="modal-footer-modern">
            <button type="button" className="cancel-btn" onClick={toggleModal}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {currentMenu ? 'Update Menu' : 'Create Menu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WhatsAppCreateMenus;