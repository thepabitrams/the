export interface GitHubEvent {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  variant: string;
  timestamp: number;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

async function fetchCommits(
  owner: string,
  repo: string,
  limit: number,
): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'portfolio-build',
        },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((commit: any): GitHubEvent => {
      const message = commit.commit?.message?.split('\n')[0] ?? 'Update';
      const sha = (commit.sha ?? '').slice(0, 7);
      const date = commit.commit?.author?.date ?? commit.commit?.committer?.date;
      return {
        id: `commit-${commit.sha}`,
        title: message,
        subtitle: `${sha} · ${relativeTime(date)}`,
        icon: 'commit',
        variant: 'blue',
        timestamp: new Date(date).getTime(),
      };
    });
  } catch {
    return [];
  }
}

function mapEvent(event: any): GitHubEvent | null {
  const base = {
    id: `event-${event.id}`,
    timestamp: new Date(event.created_at).getTime(),
  };
  const time = relativeTime(event.created_at);

  switch (event.type) {
    case 'WatchEvent':
      return {
        ...base,
        title: 'Starred the repo',
        subtitle: time,
        icon: 'star',
        variant: 'yellow',
      };

    case 'ForkEvent':
      return {
        ...base,
        title: 'Repo was forked',
        subtitle: time,
        icon: 'fork',
        variant: 'blue',
      };

    case 'ReleaseEvent': {
      const tag = event.payload?.release?.tag_name ?? '';
      return {
        ...base,
        title: tag ? `Released ${tag}` : 'New release',
        subtitle: tag ? `Tag ${tag} · ${time}` : time,
        icon: 'release',
        variant: 'purple',
      };
    }

    case 'PullRequestEvent': {
      if (event.payload?.action !== 'closed') return null;
      if (!event.payload?.pull_request?.merged) return null;
      const pr = event.payload.pull_request;
      return {
        ...base,
        title: pr.title ?? 'Pull request',
        subtitle: `Merged PR #${pr.number ?? '?'} · ${time}`,
        icon: 'merged',
        variant: 'purple',
      };
    }

    case 'IssuesEvent': {
      if (event.payload?.action !== 'closed') return null;
      const issue = event.payload.issue;
      return {
        ...base,
        title: issue?.title ?? 'Issue',
        subtitle: `Closed issue #${issue?.number ?? '?'} · ${time}`,
        icon: 'issue',
        variant: 'green',
      };
    }

    default:
      return null;
  }
}

async function fetchEvents(owner: string, repo: string): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/events?per_page=30`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'portfolio-build',
        },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const events: GitHubEvent[] = [];
    for (const raw of data) {
      const mapped = mapEvent(raw);
      if (mapped) events.push(mapped);
    }
    return events;
  } catch {
    return [];
  }
}

export async function fetchRepoActivity(
  owner: string,
  repo: string,
  limit = 5,
): Promise<GitHubEvent[]> {
  const [commits, events] = await Promise.all([
    fetchCommits(owner, repo, limit * 2),
    fetchEvents(owner, repo),
  ]);

  const merged = [...commits, ...events];
  merged.sort((a, b) => b.timestamp - a.timestamp);

  return merged.slice(0, limit);
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  };
}