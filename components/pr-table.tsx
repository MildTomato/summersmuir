import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import prMapping from '@/scripts/data/pr-post-mapping.json'

interface PR {
  number: number
  repo: string
  title: string
}

interface PRTableProps {
  slug: string
}

export function PRTable({ slug }: PRTableProps) {
  const prs = (prMapping as Record<string, PR[]>)[slug]
  
  if (!prs || prs.length === 0) return null

  return (
    <div className="my-6 rounded-lg border border-border-color overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-hover-bg text-heading">PR</TableHead>
            <TableHead className="bg-hover-bg text-heading">Repository</TableHead>
            <TableHead className="bg-hover-bg text-heading">Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prs.map((pr) => (
            <TableRow key={`${pr.repo}-${pr.number}`}>
              <TableCell>
                <a
                  href={`https://github.com/${pr.repo}/pull/${pr.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-heading underline underline-offset-2 decoration-muted hover:decoration-subtitle transition-colors font-mono"
                >
                  #{pr.number}
                </a>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {pr.repo.replace('supabase/', '')}
              </TableCell>
              <TableCell>{pr.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
