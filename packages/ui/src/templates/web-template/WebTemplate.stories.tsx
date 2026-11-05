import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../atoms/badge';
import { ArticleFeature, ArticleFeatureCover } from '../../molecules/article-feature';
import { CommunityCard } from '../../molecules/community-card';
import { ListItem, ListItemBody, ListItemContent, ListItemTitle } from '../../molecules/list-item';
import { NowCard, NowCardBody } from '../../molecules/now-card';
import { ProjectCard, ProjectCardBackdrop, ProjectCardMark } from '../../molecules/project-card';
import { BlogGrid, BlogGridFeature, BlogGridRow, BlogGridRows } from '../../organisms/blog-grid';
import { Footer, FooterLegal, FooterNavigation } from '../../organisms/footer';
import { NotesBoard, NotesBoardList, NotesBoardSide } from '../../organisms/notes-board';
import { NowStrip } from '../../organisms/now-strip';
import { TopBar, TopBarBrand } from '../../organisms/top-bar';
import { WebSection } from '../../organisms/web-section';
import { SectionShell } from '../section-shell';
import { WebTemplate } from './WebTemplate';

/** A structural page with consumer-owned header, content and footer. */
const meta = {
  title: 'Templates/WebTemplate',
  component: WebTemplate,
  tags: ['autodocs'],
  args: { content: <p>Page content</p> }
} satisfies Meta<typeof WebTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Content without optional regions. */
export const Default: Story = {};
/** Header and footer retain their own landmarks. */
export const Full: Story = { args: { topBar: <header>Page header</header>, footer: <footer>Page footer</footer> } };
/** The skip link accepts localized text. */
export const Localized: Story = { args: { messages: { skipToContent: 'Jump to main content' } } };

/** A consumer-composed catalog page; effects and choreography remain the host's responsibility. */
export const CatalogPage: Story = {
  args: {
    topBar: (
      <TopBar label='Main navigation' items={[{ id: 'writing', label: 'Writing', href: '#writing' }]}>
        <TopBarBrand>
          <a href='#home'>Studio</a>
        </TopBarBrand>
      </TopBar>
    ),
    content: (
      <>
        <h1 id='home'>Studio catalog</h1>
        <SectionShell id='writing' aria-labelledby='writing-heading'>
          <WebSection
            header={<h2 id='writing-heading'>Writing</h2>}
            body={
              <BlogGrid>
                <BlogGridFeature>
                  <ArticleFeature
                    href='#article'
                    title='Shared foundations'
                    description='How we build together.'
                    actionLabel='Read article'
                  >
                    <ArticleFeatureCover coverWord='/design' badge='Featured' />
                  </ArticleFeature>
                </BlogGridFeature>
                <BlogGridRows>
                  <BlogGridRow>
                    <ListItem variant='editorial' asChild={true}>
                      <a href='#notes'>
                        <ListItemBody>
                          <ListItemTitle>Notes from the studio</ListItemTitle>
                          <ListItemContent>Ideas in progress.</ListItemContent>
                        </ListItemBody>
                      </a>
                    </ListItem>
                  </BlogGridRow>
                </BlogGridRows>
              </BlogGrid>
            }
          />
        </SectionShell>
        <SectionShell aria-labelledby='projects-heading'>
          <WebSection
            header={<h2 id='projects-heading'>Projects and community</h2>}
            body={
              <>
                <ProjectCard title='Catalog' eyebrow='Open source'>
                  <ProjectCardBackdrop>
                    <img src='/brand/egdev-logo-with-name.png' alt='' />
                  </ProjectCardBackdrop>
                  <ProjectCardMark>
                    <img src='/brand/egdev-logo.png' alt='Studio' className='h-12 w-auto' />
                  </ProjectCardMark>
                  <p>Shared tools for building interfaces.</p>
                </ProjectCard>
                <CommunityCard title='Community' eyebrow='Open community'>
                  <p>Share work and learn together.</p>
                </CommunityCard>
              </>
            }
          />
        </SectionShell>
        <SectionShell aria-labelledby='activity-heading'>
          <WebSection
            header={<h2 id='activity-heading'>Activity and notes</h2>}
            body={
              <>
                <NowStrip label='Currently'>
                  <NowCard title='Building' size='sm' statusBadge={<Badge>In progress</Badge>}>
                    <NowCardBody>
                      <p>Making space for ideas.</p>
                    </NowCardBody>
                  </NowCard>
                  <NowCard title='Reading' size='sm'>
                    <NowCardBody>
                      <p>Exploring references.</p>
                    </NowCardBody>
                  </NowCard>
                </NowStrip>
                <NotesBoard>
                  <NotesBoardSide>
                    <h3>Notes</h3>
                  </NotesBoardSide>
                  <NotesBoardList>
                    <li>
                      <ListItem variant='editorial-divided' asChild={true}>
                        <a href='#note'>
                          <ListItemBody>
                            <ListItemTitle>Building in the open</ListItemTitle>
                          </ListItemBody>
                        </a>
                      </ListItem>
                    </li>
                  </NotesBoardList>
                </NotesBoard>
              </>
            }
          />
        </SectionShell>
      </>
    ),
    footer: (
      <Footer>
        <FooterNavigation label='Explore' items={[{ href: '#writing', label: 'Writing' }]} />
        <FooterLegal>Independent project</FooterLegal>
      </Footer>
    )
  }
};
