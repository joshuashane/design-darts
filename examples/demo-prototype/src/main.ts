// ── Types ────────────────────────────────────────────────────────────────────

interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'warning';
  type: string;
  lastModified: string;
  hitCount: number;
}

interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  resource: string;
  region: string;
  age: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const policies: Policy[] = [
  { id: '1', name: 'Block Malicious Domains',        description: 'Blocks known malicious domains from threat intelligence feeds', status: 'enabled',  type: 'Security',    lastModified: '2026-08-15', hitCount: 4812 },
  { id: '2', name: 'Allow Corporate DNS',             description: 'Permits traffic to internal corporate DNS resolvers',           status: 'enabled',  type: 'Network',     lastModified: '2026-08-10', hitCount: 98234 },
  { id: '3', name: 'Block Social Media (Legacy)',     description: 'Restricts social media platforms during work hours',            status: 'disabled', type: 'Content',     lastModified: '2026-07-22', hitCount: 0 },
  { id: '4', name: 'Threat Prevention — IoT',         description: 'Threat prevention profile for IoT device segments',            status: 'warning',  type: 'Security',    lastModified: '2026-08-18', hitCount: 126 },
  { id: '5', name: 'SaaS App Control',               description: 'Granular control for sanctioned and unsanctioned SaaS apps',   status: 'enabled',  type: 'Application', lastModified: '2026-08-20', hitCount: 15092 },
  { id: '6', name: 'Data Loss Prevention',            description: 'DLP rules for sensitive file types on egress traffic',         status: 'enabled',  type: 'Compliance',  lastModified: '2026-08-01', hitCount: 341 },
  { id: '7', name: 'Guest WiFi Isolation',            description: 'Isolates guest network from internal corporate resources',     status: 'enabled',  type: 'Network',     lastModified: '2026-06-30', hitCount: 7823 },
  { id: '8', name: 'URL Filtering — Gambling',        description: 'Blocks gambling and lottery websites',                        status: 'disabled', type: 'Content',     lastModified: '2026-05-12', hitCount: 0 },
];

const alerts: Alert[] = [
  { id: 'a1', severity: 'critical', title: 'Exposed S3 bucket with PII data',            resource: 's3://prod-user-data',         region: 'us-east-1',    age: '2h' },
  { id: 'a2', severity: 'critical', title: 'Root account login detected',                resource: 'IAM/root',                    region: 'Global',        age: '4h' },
  { id: 'a3', severity: 'high',     title: 'Security group allows unrestricted SSH',      resource: 'sg-0a1b2c3d4e',               region: 'eu-west-1',    age: '1d' },
  { id: 'a4', severity: 'high',     title: 'RDS instance not encrypted at rest',         resource: 'db-prod-analytics',           region: 'ap-southeast-1', age: '3d' },
  { id: 'a5', severity: 'medium',   title: 'CloudTrail logging disabled in region',      resource: 'CloudTrail/ap-northeast-1',   region: 'ap-northeast-1', age: '5d' },
  { id: 'a6', severity: 'medium',   title: 'MFA not enabled on IAM users',              resource: '12 IAM users',                region: 'Global',        age: '7d' },
  { id: 'a7', severity: 'low',      title: 'Unused IAM credentials (90+ days)',         resource: 'IAM/svc-legacy-deploy',       region: 'Global',        age: '14d' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: Policy['status']): string {
  const map = { enabled: 'badge-enabled', disabled: 'badge-disabled', warning: 'badge-warning' };
  const label = status === 'warning' ? 'Review' : status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${map[status]}">${label}</span>`;
}

function severityDot(sev: Alert['severity']): string {
  const colors: Record<Alert['severity'], string> = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6' };
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${colors[sev]};margin-right:6px"></span>`;
}

// ── Shared shell ──────────────────────────────────────────────────────────────

function renderShell(page: 'policies' | 'dashboard', inner: string): string {
  const sideItems = [
    { icon: '🔒', label: 'Security Policies', page: 'policies' },
    { icon: '📊', label: 'Threat Dashboard',  page: 'dashboard' },
    { icon: '🌐', label: 'Network Rules',     page: '' },
    { icon: '📋', label: 'Compliance',        page: '' },
    { icon: '🔍', label: 'URL Filtering',     page: '' },
  ];
  const bottomItems = [
    { icon: '🛡', label: 'Threat Prevention', page: '' },
    { icon: '⚙', label: 'Settings',          page: '' },
  ];

  function sideLink(item: { icon: string; label: string; page: string }): string {
    const active = item.page === page;
    const href = item.page ? `#/${item.page}` : '#';
    return `<a href="${href}" class="sidebar-item${active ? ' active' : ''}" data-page="${item.page}">
      <span class="sidebar-icon">${item.icon}</span>${item.label}
    </a>`;
  }

  return `
    <div class="app-shell">
      <nav class="navbar">
        <span class="navbar-brand">ACME SECURITY</span>
        <div class="navbar-nav">
          <a href="#/policies" class="nav-item${page === 'policies' ? ' active' : ''}">Policies</a>
          <a href="#/dashboard" class="nav-item${page === 'dashboard' ? ' active' : ''}">Dashboard</a>
          <a href="#" class="nav-item">Assets</a>
          <a href="#" class="nav-item">Alerts</a>
        </div>
      </nav>
      <div class="content">
        <aside class="sidebar">
          <div class="sidebar-section">
            <div class="sidebar-title">Policies</div>
            ${sideItems.slice(0, 2).map(sideLink).join('')}
          </div>
          <div class="sidebar-section">
            <div class="sidebar-title">Management</div>
            ${sideItems.slice(2).map(sideLink).join('')}
          </div>
          <div class="sidebar-section" style="margin-top:auto">
            <div class="sidebar-title">System</div>
            ${bottomItems.map(sideLink).join('')}
          </div>
        </aside>
        <main class="main">${inner}</main>
      </div>
    </div>
  `;
}

// ── Policies screen ───────────────────────────────────────────────────────────

function renderPolicies(query = ''): void {
  const filtered = query
    ? policies.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.type.toLowerCase().includes(query.toLowerCase()))
    : policies;

  const enabled = filtered.filter(p => p.status === 'enabled').length;
  const disabled = filtered.filter(p => p.status === 'disabled').length;
  const warnings = filtered.filter(p => p.status === 'warning').length;
  const totalHits = filtered.reduce((s, p) => s + p.hitCount, 0);

  const inner = `
    <div class="page-header">
      <div>
        <div class="page-title">Security Policies</div>
        <div class="page-subtitle">Manage and monitor your organization's security posture</div>
      </div>
      <button class="btn btn-primary" data-testid="add-policy-btn">+ Add Policy</button>
    </div>
    <div class="stats-row">
      <div class="stat-card" data-testid="stat-total">
        <div class="stat-value">${filtered.length}</div>
        <div class="stat-label">Total Policies</div>
        <div class="stat-delta">↑ 2 this month</div>
      </div>
      <div class="stat-card" data-testid="stat-enabled">
        <div class="stat-value" style="color:#166534">${enabled}</div>
        <div class="stat-label">Enabled</div>
        <div class="stat-delta">↑ 1 this month</div>
      </div>
      <div class="stat-card" data-testid="stat-disabled">
        <div class="stat-value" style="color:#6b7280">${disabled}</div>
        <div class="stat-label">Disabled</div>
      </div>
      <div class="stat-card" data-testid="stat-warnings">
        <div class="stat-value" style="color:#92400e">${warnings}</div>
        <div class="stat-label">Need Review</div>
        <div class="stat-delta" style="color:#dc2626">Action required</div>
      </div>
    </div>
    <div class="toolbar">
      <input class="search-input" placeholder="Search policies…" value="${query}" id="search" data-testid="search-input" />
      <span class="filter-tag all">All (${filtered.length})</span>
      <span class="filter-tag enabled">Enabled</span>
      <span class="filter-tag disabled">Disabled</span>
    </div>
    <div class="data-table">
      <div class="table-head">
        <div>Policy Name</div><div>Type</div><div>Status</div>
        <div>Hit Count</div><div>Actions</div>
      </div>
      ${filtered.map(p => `
        <div class="table-row" data-id="${p.id}" data-testid="policy-row-${p.id}">
          <div>
            <div class="policy-name">${p.name}</div>
            <div class="policy-meta">${p.description}</div>
          </div>
          <div>${p.type}</div>
          <div>${statusBadge(p.status)}</div>
          <div style="color:#6b7280">${p.hitCount.toLocaleString()}</div>
          <div><button class="action-btn">Edit</button></div>
        </div>`).join('')}
    </div>
  `;

  document.getElementById('app')!.innerHTML = renderShell('policies', inner);

  const searchInput = document.getElementById('search') as HTMLInputElement;
  searchInput.addEventListener('input', e => renderPolicies((e.target as HTMLInputElement).value));
  searchInput.focus();
  searchInput.setSelectionRange(query.length, query.length);
}

// ── Dashboard screen ──────────────────────────────────────────────────────────

function renderDashboard(): void {
  const critCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const medCount  = alerts.filter(a => a.severity === 'medium').length;
  const lowCount  = alerts.filter(a => a.severity === 'low').length;

  const inner = `
    <div class="page-header">
      <div>
        <div class="page-title">Threat Dashboard</div>
        <div class="page-subtitle">Real-time security posture across your cloud environment</div>
      </div>
      <button class="btn btn-primary" data-testid="export-report-btn">↓ Export Report</button>
    </div>

    <div class="stats-row">
      <div class="stat-card" data-testid="stat-critical" style="border-left:3px solid #ef4444">
        <div class="stat-value" style="color:#ef4444">${critCount}</div>
        <div class="stat-label">Critical</div>
        <div class="stat-delta" style="color:#ef4444">Immediate action</div>
      </div>
      <div class="stat-card" data-testid="stat-high" style="border-left:3px solid #f97316">
        <div class="stat-value" style="color:#f97316">${highCount}</div>
        <div class="stat-label">High</div>
        <div class="stat-delta" style="color:#f97316">↑ 1 this week</div>
      </div>
      <div class="stat-card" data-testid="stat-medium" style="border-left:3px solid #eab308">
        <div class="stat-value" style="color:#eab308">${medCount}</div>
        <div class="stat-label">Medium</div>
      </div>
      <div class="stat-card" data-testid="stat-low" style="border-left:3px solid #3b82f6">
        <div class="stat-value" style="color:#3b82f6">${lowCount}</div>
        <div class="stat-label">Low</div>
        <div class="stat-delta">↓ 3 this week</div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="dash-panel" data-testid="alerts-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Open Alerts</span>
          <button class="action-btn" data-testid="view-all-alerts">View all</button>
        </div>
        ${alerts.map(a => `
          <div class="alert-row" data-testid="alert-${a.id}">
            <div class="alert-sev">${severityDot(a.severity)}<span class="alert-sev-label alert-${a.severity}">${a.severity}</span></div>
            <div class="alert-body">
              <div class="alert-title">${a.title}</div>
              <div class="alert-meta">${a.resource} · ${a.region}</div>
            </div>
            <div class="alert-age">${a.age}</div>
          </div>`).join('')}
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="dash-panel" data-testid="coverage-panel">
          <div class="dash-panel-header">
            <span class="dash-panel-title">Policy Coverage</span>
          </div>
          <div class="coverage-bar-list">
            ${[
              { label: 'Security',    pct: 92, color: '#22c55e' },
              { label: 'Network',     pct: 87, color: '#3b82f6' },
              { label: 'Compliance',  pct: 74, color: '#eab308' },
              { label: 'Application', pct: 61, color: '#f97316' },
              { label: 'Content',     pct: 45, color: '#ef4444' },
            ].map(item => `
              <div class="coverage-row" data-testid="coverage-${item.label.toLowerCase()}">
                <div class="coverage-label">${item.label}</div>
                <div class="coverage-track">
                  <div class="coverage-fill" style="width:${item.pct}%;background:${item.color}"></div>
                </div>
                <div class="coverage-pct">${item.pct}%</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="dash-panel" data-testid="activity-panel">
          <div class="dash-panel-header">
            <span class="dash-panel-title">Recent Activity</span>
          </div>
          ${[
            { time: '10m ago', msg: 'Policy "Block Malicious Domains" triggered 48 times' },
            { time: '1h ago',  msg: 'New critical alert: Exposed S3 bucket detected' },
            { time: '3h ago',  msg: 'Admin updated "SaaS App Control" policy' },
            { time: '1d ago',  msg: 'Scheduled report generated and emailed to team' },
          ].map(e => `
            <div class="activity-row">
              <div class="activity-time">${e.time}</div>
              <div class="activity-msg">${e.msg}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('app')!.innerHTML = renderShell('dashboard', inner);
}

// ── Router ────────────────────────────────────────────────────────────────────

function route(): void {
  const hash = location.hash || '#/policies';
  if (hash.startsWith('#/dashboard')) {
    // Tell tack which SPA screen we're on so comments are scoped correctly
    (window as { Tack?: { setScreenState: (s: string) => void } }).Tack?.setScreenState('dashboard');
    renderDashboard();
  } else {
    (window as { Tack?: { setScreenState: (s: string) => void } }).Tack?.setScreenState('policies');
    renderPolicies();
  }
}

window.addEventListener('hashchange', route);
route();
