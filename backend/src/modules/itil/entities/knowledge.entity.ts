export interface KnowledgeArticleEntity {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  tags: string[];
  relatedIncidents: string[];
  createdAt: Date;
  updatedAt: Date;
}
