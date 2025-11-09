import { describe, it, expect } from 'vitest';
import { UpsertProfileUseCase, SendProposalUseCase, ActOnProposalUseCase } from '@/server/core/usecases/matching/usecases';
import type { MatchingRepository, MatchProposalDto, PlayerProfileDto } from '@/server/core/usecases/matching/ports';
import type { AuditPort } from '@/server/core/ports/audit';

class Repo implements MatchingRepository {
  async upsertProfile(input:any){ return { userId: input.userId, level: input.level, area: input.area } as PlayerProfileDto; }
  async searchPlayers(){ return []; }
  async createProposal(input:any){ return { id:'p1', fromUser: input.fromUser, toUser: input.toUser, start: input.start, end: input.end, status:'pending' } as any; }
  async updateProposalStatus(id:any, status:any){ return { id, fromUser:'f', toUser:'t', start:new Date(0), end:new Date(1), status } as any; }
  async findProposal(id:any){ return { id, fromUser:'f', toUser:'u2', start:new Date(0), end:new Date(1), status:'pending' } as any; }
  async listIncoming(){ return []; }
  async listOutgoing(){ return []; }
}
class CaptureAudit implements AuditPort { events:any[]=[]; log(e:any){ this.events.push(e);} }

describe('Matching usecases', () => {
  it('upsert profile logs audit', async () => {
    const repo = new Repo(); const audit = new CaptureAudit();
    const uc = new UpsertProfileUseCase(repo as any, audit);
    const p = await uc.execute({ userId:'u1', level:3 });
    expect(p.userId).toBe('u1');
    expect(audit.events.some(e=>e.msg==='matching.profile.upsert')).toBe(true);
  });

  it('send proposal validates and logs', async () => {
    const repo = new Repo(); const audit = new CaptureAudit();
    const uc = new SendProposalUseCase(repo as any, audit);
    await expect(uc.execute({ fromUser:'u1', toUser:'u1', start:new Date(), end:new Date() })).rejects.toThrow();
    const p = await uc.execute({ fromUser:'u1', toUser:'u2', start:new Date(), end:new Date() });
    expect(p.id).toBe('p1');
    expect(audit.events.some(e=>e.msg==='matching.proposal.send')).toBe(true);
  });

  it('act on proposal checks recipient and logs', async () => {
    const repo = new Repo(); const audit = new CaptureAudit();
    const uc = new ActOnProposalUseCase(repo as any, audit);
    await expect(uc.execute({ userId:'wrong', id:'p1', action:'accept' })).rejects.toThrow();
    const r = await uc.execute({ userId:'u2', id:'p1', action:'accept' });
    expect(r.status).toBe('accepted');
    expect(audit.events.some(e=>e.msg==='matching.proposal.act')).toBe(true);
  });
});

