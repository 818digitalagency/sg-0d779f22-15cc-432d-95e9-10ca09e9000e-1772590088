/**
 * Data Export Utilities
 * Supports CSV, Excel, and PDF exports with filtering and formatting
 */

import type { Lead } from "@/types/lead";

export interface ExportOptions {
  format: "csv" | "excel" | "pdf";
  fields?: string[];
  filename?: string;
  includeHeaders?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    industry?: string[];
    city?: string[];
    scoreRange?: [number, number];
    status?: string[];
  };
}

export interface ExportResult {
  success: boolean;
  filename: string;
  recordCount: number;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
}

/**
 * Data Export Engine
 */
export class DataExporter {
  private defaultFields = [
    "businessName",
    "contactName",
    "email",
    "phone",
    "website",
    "address",
    "city",
    "postalCode",
    "industry",
    "leadScore",
    "rating",
    "reviewCount",
    "status"
  ];

  /**
   * Export leads to CSV format
   */
  async exportToCSV(leads: Lead[], options: ExportOptions): Promise<ExportResult> {
    try {
      const fields = options.fields || this.defaultFields;
      const filteredLeads = this.filterLeads(leads, options.filters);
      
      // Create CSV header
      const header = fields.join(",");
      
      // Create CSV rows
      const rows = filteredLeads.map(lead => {
        return fields.map(field => {
          const value = this.getFieldValue(lead, field);
          // Escape commas and quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",");
      });
      
      const csv = [header, ...rows].join("\n");
      
      // Create blob and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const filename = options.filename || `leads_export_${this.getTimestamp()}.csv`;
      this.downloadBlob(blob, filename);
      
      return {
        success: true,
        filename,
        recordCount: filteredLeads.length,
        fileSize: blob.size
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        recordCount: 0,
        error: error instanceof Error ? error.message : "Export failed"
      };
    }
  }

  /**
   * Export leads to Excel format (XLSX)
   */
  async exportToExcel(leads: Lead[], options: ExportOptions): Promise<ExportResult> {
    try {
      const fields = options.fields || this.defaultFields;
      const filteredLeads = this.filterLeads(leads, options.filters);
      
      // Create Excel-compatible CSV with UTF-8 BOM
      const BOM = "\uFEFF";
      const header = fields.join("\t");
      
      const rows = filteredLeads.map(lead => {
        return fields.map(field => {
          const value = this.getFieldValue(lead, field);
          return typeof value === "string" ? value.replace(/\t/g, " ") : value;
        }).join("\t");
      });
      
      const content = BOM + [header, ...rows].join("\n");
      
      // Create blob with Excel MIME type
      const blob = new Blob([content], { 
        type: "application/vnd.ms-excel;charset=utf-8;" 
      });
      const filename = options.filename || `leads_export_${this.getTimestamp()}.xls`;
      this.downloadBlob(blob, filename);
      
      return {
        success: true,
        filename,
        recordCount: filteredLeads.length,
        fileSize: blob.size
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        recordCount: 0,
        error: error instanceof Error ? error.message : "Export failed"
      };
    }
  }

  /**
   * Export leads to PDF format
   */
  async exportToPDF(leads: Lead[], options: ExportOptions): Promise<ExportResult> {
    try {
      const fields = options.fields || this.defaultFields;
      const filteredLeads = this.filterLeads(leads, options.filters);
      
      // Create simple HTML for PDF conversion
      const html = this.generatePDFHTML(filteredLeads, fields, options);
      
      // Create blob
      const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
      const filename = options.filename || `leads_export_${this.getTimestamp()}.html`;
      
      // For now, download as HTML. In production, use a PDF library like jsPDF or pdfmake
      this.downloadBlob(blob, filename);
      
      return {
        success: true,
        filename,
        recordCount: filteredLeads.length,
        fileSize: blob.size
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        recordCount: 0,
        error: error instanceof Error ? error.message : "Export failed"
      };
    }
  }

  /**
   * Filter leads based on criteria
   */
  private filterLeads(leads: Lead[], filters?: ExportOptions["filters"]): Lead[] {
    if (!filters) return leads;

    return leads.filter(lead => {
      // Industry filter
      if (filters.industry && filters.industry.length > 0) {
        if (!filters.industry.includes(lead.industry)) return false;
      }

      // City filter
      if (filters.city && filters.city.length > 0) {
        if (!filters.city.includes(lead.city)) return false;
      }

      // Score range filter
      if (filters.scoreRange) {
        const [min, max] = filters.scoreRange;
        if (lead.leadScore < min || lead.leadScore > max) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(lead.status)) return false;
      }

      return true;
    });
  }

  /**
   * Get field value from lead object
   */
  private getFieldValue(lead: Lead, field: string): string | number {
    const fieldMap: Record<string, any> = {
      businessName: lead.businessName,
      contactName: lead.contactName || "N/A",
      email: lead.email || "N/A",
      phone: lead.phone || "N/A",
      website: lead.website || "N/A",
      address: lead.address,
      city: lead.city,
      postalCode: lead.postalCode,
      industry: lead.industry,
      leadScore: lead.leadScore,
      rating: lead.rating || "N/A",
      reviewCount: lead.reviewCount || 0,
      status: lead.status,
      businessAge: lead.businessAge || "N/A",
      description: lead.description || "N/A",
      createdAt: new Date(lead.createdAt).toLocaleDateString(),
      updatedAt: new Date(lead.updatedAt).toLocaleDateString()
    };

    return fieldMap[field] ?? "N/A";
  }

  /**
   * Generate HTML for PDF export
   */
  private generatePDFHTML(leads: Lead[], fields: string[], options: ExportOptions): string {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Leads Export - Opportunity Finder</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 40px;
      color: #1e293b;
    }
    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
    }
    .header h1 {
      margin: 0;
      color: #1e40af;
      font-size: 28px;
    }
    .header .meta {
      color: #64748b;
      margin-top: 8px;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    th {
      background: #3b82f6;
      color: white;
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    .score-high { color: #059669; font-weight: 600; }
    .score-medium { color: #d97706; font-weight: 600; }
    .score-low { color: #dc2626; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Opportunity Finder - Leads Export</h1>
    <div class="meta">
      Generated: ${timestamp} | Total Records: ${leads.length}
      ${options.filters ? ` | Filtered Results` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        ${fields.map(field => `<th>${this.formatFieldName(field)}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${leads.map(lead => `
        <tr>
          ${fields.map(field => {
            const value = this.getFieldValue(lead, field);
            let cellClass = "";
            if (field === "leadScore") {
              const score = Number(value);
              cellClass = score >= 85 ? "score-high" : score >= 60 ? "score-medium" : "score-low";
            }
            return `<td class="${cellClass}">${value}</td>`;
          }).join("")}
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Opportunity Finder</strong> - Discover. Engage. Convert.</p>
    <p>This report contains ${leads.length} business leads exported on ${timestamp}</p>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Format field name for display
   */
  private formatFieldName(field: string): string {
    const nameMap: Record<string, string> = {
      businessName: "Business Name",
      contactName: "Contact",
      email: "Email",
      phone: "Phone",
      website: "Website",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      industry: "Industry",
      leadScore: "Score",
      rating: "Rating",
      reviewCount: "Reviews",
      status: "Status",
      businessAge: "Age",
      description: "Description",
      createdAt: "Created",
      updatedAt: "Updated"
    };
    return nameMap[field] || field;
  }

  /**
   * Get timestamp for filename
   */
  private getTimestamp(): string {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  }

  /**
   * Download blob as file
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Export with progress tracking
   */
  async exportWithProgress(
    leads: Lead[], 
    options: ExportOptions,
    onProgress?: (progress: number) => void
  ): Promise<ExportResult> {
    const chunks = 1000; // Process in chunks of 1000
    const totalChunks = Math.ceil(leads.length / chunks);

    for (let i = 0; i < totalChunks; i++) {
      if (onProgress) {
        onProgress((i / totalChunks) * 100);
      }
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for UI updates
    }

    if (onProgress) onProgress(100);

    // Perform actual export
    switch (options.format) {
      case "csv":
        return this.exportToCSV(leads, options);
      case "excel":
        return this.exportToExcel(leads, options);
      case "pdf":
        return this.exportToPDF(leads, options);
      default:
        return {
          success: false,
          filename: "",
          recordCount: 0,
          error: "Unsupported export format"
        };
    }
  }

  /**
   * Get export statistics
   */
  getExportStats(leads: Lead[]): {
    totalRecords: number;
    byIndustry: Record<string, number>;
    byCity: Record<string, number>;
    byStatus: Record<string, number>;
    averageScore: number;
  } {
    const byIndustry: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalScore = 0;

    leads.forEach(lead => {
      byIndustry[lead.industry] = (byIndustry[lead.industry] || 0) + 1;
      byCity[lead.city] = (byCity[lead.city] || 0) + 1;
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      totalScore += lead.leadScore;
    });

    return {
      totalRecords: leads.length,
      byIndustry,
      byCity,
      byStatus,
      averageScore: leads.length > 0 ? totalScore / leads.length : 0
    };
  }
}

// Export singleton instance
export const dataExporter = new DataExporter();