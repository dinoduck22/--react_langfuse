import { useState } from "react";
import {
  Info,
  Play,
  RotateCcw,
  Plus,
  Copy,
  Save,
  Wrench,
  BookText,
  Variable,
  Search,
  Minus,
  Edit,
  X,
} from "lucide-react";
import styles from "./Playground.module.css";
import ChatBox, { ChatMessage } from "../../components/ChatBox/ChatBox";
import NewLlmConnectionModal from "./NewLlmConnectionModal";
import PlaygroundPanel from "./PlaygroundPanel";
import NewItemModal from "./NewItemModal";
import SavePromptPopover from "./SavePromptPopover";

interface Tool { id: string; name: string; description: string; }
interface Schema { id: string; name: string; description: string; }

// Tools Panel Content Component
const ToolsPanelContent = ({ attachedTools, availableTools, onAddTool, onRemoveTool, onCreateTool }: { attachedTools: Tool[]; availableTools: Tool[]; onAddTool: (tool: Tool) => void; onRemoveTool: (id: string) => void; onCreateTool: () => void; }) => (
    <>
      {attachedTools.map(tool => (
        <div className={styles.toolSection} key={tool.id}><div className={styles.toolItem}><div className={styles.toolInfo}><Wrench size={14} /><div className={styles.toolText}><span className={styles.toolName}>{tool.name}</span><span className={styles.toolDesc}>{tool.description}</span></div></div><div className={styles.iconCircle} onClick={() => onRemoveTool(tool.id)}><Minus size={14} /></div></div></div>
      ))}
      <div className={styles.toolSearch}><Search size={14} /><input type="text" placeholder="Search tools..." /></div>
      <div className={styles.toolList}>
        {availableTools.map(tool => (
          <div className={styles.toolItem} key={tool.id} onDoubleClick={() => onAddTool(tool)}><div className={styles.toolInfo}><Wrench size={14} /><div className={styles.toolText}><span className={styles.toolName}>{tool.name}</span><span className={styles.toolDesc}>{tool.description}</span></div></div><button className={styles.editButton}><Edit size={14} /></button></div>
        ))}
      </div>
      <button className={styles.toolButton} onClick={onCreateTool}><Plus size={14} /> Create new tool</button>
    </>
  );

  // Schema Panel Content Component
  const SchemaPanelContent = ({ userSchema, onAddSchema, onRemoveSchema, availableSchemas, onCreateSchema }: { userSchema: Schema | null; onAddSchema: (schema: Schema) => void; onRemoveSchema: (id: string) => void; availableSchemas: Schema[]; onCreateSchema: () => void; }) => (
    <>
      {userSchema && (
        <div className={styles.toolSection}><div className={styles.toolItem}><div className={styles.toolInfo}><BookText size={14} /><div className={styles.toolText}><span className={styles.toolName}>{userSchema.name}</span><span className={styles.toolDesc}>{userSchema.description}</span></div></div><div className={styles.iconCircle} onClick={() => onRemoveSchema(userSchema.id)}><Minus size={14} /></div></div></div>
      )}
      <div className={styles.toolSearch}><Search size={14} /><input type="text" placeholder="Search schemas..." /></div>
      <div className={styles.toolList}>
        {availableSchemas.map(schema => (
          <div className={styles.toolItem} key={schema.id} onDoubleClick={() => onAddSchema(schema)}><div className={styles.toolInfo}><div className={styles.toolText}><span className={styles.toolName}>{schema.name}</span><span className={styles.toolDesc}>{schema.description}</span></div></div><button className={styles.editButton}><Edit size={14} /></button></div>
        ))}
      </div>
      <button className={styles.toolButton} onClick={onCreateSchema}><Plus size={14} /> Create new schema</button>
    </>
  );


// 단일 패널 컴포넌트
const PlaygroundComponent = ({ onCopy, onRemove, showRemoveButton }: { onCopy: () => void, onRemove: () => void, showRemoveButton: boolean}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLlmModalOpen, setIsLlmModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'tool' | 'schema' | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isSavePopoverOpen, setIsSavePopoverOpen] = useState(false);

  const [attachedTools, setAttachedTools] = useState<Tool[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([
    { id: 'tool-1', name: 'tool', description: 'ddd' },
    { id: 'tool-2', name: 'search_web', description: 'Search the web for information.' },
  ]);
  const [attachedUserSchema, setAttachedUserSchema] = useState<Schema | null>(null);
  const [availableSchemas, setAvailableSchemas] = useState<Schema[]>([
    { id: 'schema-1', name: 'waetae', description: 'weddfwe' }
  ]);

  const togglePanel = (panelName: string) => { setActivePanel(activePanel === panelName ? null : panelName); };
  const handleAddTool = (toolToAdd: Tool) => { if (!attachedTools.some(t => t.id === toolToAdd.id)) setAttachedTools(prev => [...prev, toolToAdd]); };
  const handleRemoveTool = (toolId: string) => { setAttachedTools(prev => prev.filter(t => t.id !== toolId)); };
  const handleAddSchema = (schemaToAdd: Schema) => { setAttachedUserSchema(schemaToAdd); };
  const handleRemoveSchema = (schemaId: string) => { if (attachedUserSchema && attachedUserSchema.id === schemaId) setAttachedUserSchema(null); };

  return (
    <div className={styles.panelContainer}>
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span>Model</span>
                <div className={styles.cardActions}>
                    <button className={styles.iconActionBtn} onClick={onCopy}><Copy size={16} /></button>
                    <button className={styles.iconActionBtn} onClick={() => setIsSavePopoverOpen(prev => !prev)}>
                        <Save size={16} />
                    </button>
                    {showRemoveButton && (
                        <button className={styles.iconActionBtn} onClick={onRemove}><X size={16} /></button>
                    )}
                </div>
            </div>
            <div className={styles.cardBody}>
                <p className={styles.noApiKeyText}>No LLM API key set in project.</p>
                <button className={styles.addLlmBtn} onClick={() => setIsLlmModalOpen(true)}><Plus size={16} /> Add LLM Connection</button>
            </div>
            {isSavePopoverOpen && <SavePromptPopover onSaveAsNew={() => {console.log("onSaveAsNew")}} />}
        </div>

        <div className={styles.controlsBar}>
            <button className={styles.controlBtn} onClick={() => togglePanel("tools")}><Wrench size={14} /> Tools <span className={styles.badge}>{attachedTools.length}</span></button>
            <button className={styles.controlBtn} onClick={() => togglePanel("schema")}><BookText size={14} /> Schema <span className={styles.badge}>{attachedUserSchema ? 1 : 0}</span></button>
            <button className={styles.controlBtn}><Variable size={14} /> Variables</button>
        </div>

        {activePanel === "tools" && (
            <PlaygroundPanel title="Tools" description="Configure tools for your model to use.">
                <ToolsPanelContent attachedTools={attachedTools} availableTools={availableTools} onAddTool={handleAddTool} onRemoveTool={handleRemoveTool} onCreateTool={() => setModalType('tool')} />
            </PlaygroundPanel>
        )}
        {activePanel === "schema" && (
            <PlaygroundPanel title="Structured Output" description="Configure JSON schema for structured output.">
                <SchemaPanelContent userSchema={attachedUserSchema} availableSchemas={availableSchemas} onAddSchema={handleAddSchema} onRemoveSchema={handleRemoveSchema} onCreateSchema={() => setModalType('schema')} />
            </PlaygroundPanel>
        )}

        <ChatBox messages={messages} setMessages={setMessages} />

        <div className={styles.outputCard}>
            <div className={styles.cardHeader}><span>Output</span></div>
            <div className={styles.outputBody}></div>
        </div>

        <div className={styles.footer}>
            <button className={styles.submitBtn}>Submit</button>
        </div>

        <NewLlmConnectionModal isOpen={isLlmModalOpen} onClose={() => setIsLlmModalOpen(false)} />
        {modalType && <NewItemModal isOpen={!!modalType} type={modalType} onClose={() => setModalType(null)} />}
    </div>
  )
};


// ===== 메인 컴포넌트 =====
export default function Playground() {
  const [panels, setPanels] = useState<number[]>([Date.now()]); // 초기 패널 1개

  const addPanel = () => {
    setPanels(prev => [...prev, Date.now()]); // 고유 ID로 Date.now() 사용
  };

  const removePanel = (idToRemove: number) => {
    // 마지막 패널은 삭제하지 않음
    if (panels.length > 1) {
        setPanels(prev => prev.filter(id => id !== idToRemove));
    }
  };

  const resetPlayground = () => {
    setPanels([Date.now()]); // 패널을 다시 1개로 초기화
  };

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Playground <Info size={16} /></div>
          <div className={styles.actions}>
            <span className={styles.windowInfo}>{panels.length} windows</span>
            <button className={styles.actionBtn} onClick={addPanel}><Plus size={16} /> Add Panel</button>
            <button className={styles.actionBtn}><Play size={16} /> Run All (Ctrl + Enter)</button>
            <button className={styles.actionBtn} onClick={resetPlayground}><RotateCcw size={16} /> Reset playground</button>
          </div>
        </div>

        <div className={styles.mainGrid}>
            {panels.map(id => (
                <PlaygroundComponent
                    key={id}
                    onCopy={addPanel}
                    onRemove={() => removePanel(id)}
                    showRemoveButton={panels.length > 1}
                />
            ))}
        </div>
      </div>
  );
}